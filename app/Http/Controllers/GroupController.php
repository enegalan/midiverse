<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use App\Models\GroupNotification;
use App\Models\UserNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    public static function loadGroupData(&$group)
    {
        app()->call([self::class, 'getFollowers'], compact('group'));
        app()->call([self::class, 'getGroupConcertsReceivedLikes'], compact('group'));
        app()->call([self::class, 'getGroupMidis'], compact('group'));
        app()->call([self::class, 'getConcerts'], compact('group'));
        app()->call([self::class, 'getMembers'], compact('group'));
        app()->call([self::class, 'getGroupRoles'], compact('group'));
    }

    public static function getTopGroups()
    {
        $limit = 10;
        return Group::withCount('followers')
            ->orderByDesc('followers_count')
            ->limit($limit)
            ->get();
    }

    public static function existsByName(Request $request)
    {
        $name = $request->input('name');
        $group = Group::where('name', $name)->first();
        if ($group) {
            return response()->json(['status' => 'true']);
        }
        return response()->json(['status' => 'false']);
    }

    public static function delete($name)
    {
        $group = Group::where('name', $name)->first();
        if ($group) {
            // Remove group from groups table;
            $group->delete();
            // Get group concerts from concerts table
            $concerts = $group->concerts()->get();
            // Remove group concerts likes from concert_likes table
            // Remove group concerts members from concert_members table
            // Remove group concerts midis from concert_midis table
            // Remove group concerts roles from concert_roles table
            foreach ($concerts as $concert) {
                $concert->likes()->delete();
                $concert->members()->detach();
                $concert->midis()->delete();
                $concert->roles()->delete();
            }
            // Remove group from group_followers table
            $group->followers()->detach();
            // Remove group from group_members table
            $group->members()->detach();
            // Remove group from group_midis table
            $group->midis()->delete();
        }
    }

    public static function store(Request $request)
    {
        $name = $request->input('name');
        $description = $request->input('description');
        $logoFile = $request->file('logo');
        $bannerFile = $request->file('banner');
        $logoName = $logoFile->hashName();
        $logoPath = $logoFile->storeAs('group/logo', $logoName, 'public');
        $bannerName = $bannerFile->hashName();
        $bannerPath = $bannerFile->storeAs('group/banner', $bannerName, 'public');
        $created_group = Group::createOrFirst([
            'name' => $name,
            'description' => $description,
            'logo' => '/storage/' . $logoPath,
            'banner' => '/storage/' . $bannerPath,
        ]);
        // Insert user as group member
        \DB::table('group_members')->insert(['group_id' => $created_group['id'], 'user_id' => auth()->user()->id]);
        // Insert user as owner of the new group
        $groupOwnerRoleId = 5;
        \DB::table('group_roles')->insert(['role_id' => $groupOwnerRoleId, 'group_id' => $created_group['id'], 'user_id' => auth()->user()->id]);
    }

    public static function update(Request $request, $id)
    {
        $group = Group::find($id);
        $name = $request->input('name');
        $description = $request->input('description');
        $visibility = $request->input('visibility');
        $logoFile = $request->file('logo');
        $bannerFile = $request->file('banner');

        // Remove old logo if it exists
        if ($group->logo && $logoFile) {
            \Storage::disk('public')->delete(str_replace('/storage/', '', $group->logo));
        }

        // Remove old banner if it exists
        if ($group->banner && $bannerFile) {
            \Storage::disk('public')->delete(str_replace('/storage/', '', $group->banner));
        }

        $group->name = $name;
        $group->description = $description;
        $group->visibility = $visibility;

        if ($logoFile) {
            $logoName = $logoFile->hashName();
            $logoPath = $logoFile->storeAs('group/logo', $logoName, 'public');
            $group->logo = '/storage/' . $logoPath;
        }

        if ($bannerFile) {
            $bannerName = $bannerFile->hashName();
            $bannerPath = $bannerFile->storeAs('group/banner', $bannerName, 'public');
            $group->banner = '/storage/' . $bannerPath;
        }

        $group->save();
    }

    public function isFollowing($name)
    {
        if (auth()->check()) {
            $group = Group::where('name', $name)->first();
            $isGroupMember = $this->isGroupUserMember(auth()->user(), $group);
            if ($group && !$isGroupMember) {
                $isFollowing = \DB::table('group_followers')
                    ->where('group_id', $group->id)
                    ->where('follower_id', auth()->user()->id)
                    ->exists();
                return response()->json(['status' => $isFollowing]);
            } else {
                return response()->json(['status' => null, 'message' => $isGroupMember]);
            }
        } else {
            return response()->json(['status' => false]);
        }
    }
    public static function getAll()
    {
        return Group::all();
    }

    public static function isGroupUserMember($user, $group)
    {
        return \DB::table('group_members')->where('user_id', $user['id'])->where('group_id', $group['id'])->exists();
    }

    public function toggleFollow($name)
    {
        $group = Group::where('name', $name)->first();
        $isGroupMember = $this->isGroupUserMember(auth()->user(), $group);
        if (auth()->check() && $group && !$isGroupMember) {
            $authUser = auth()->user();
            $isFollowing = $authUser->group_followings->contains($group);
            if ($isFollowing) {
                $authUser->group_followings()->detach($group->id);
                $status = false;
            } else {
                if ($group && $group->visibility == 1) {
                    $followAlreadySent = GroupNotification::where('from_user_id', $authUser->id)->where('group_id', $group->id)->where('type', GroupNotification::NOTIFICATION_TYPE_FOLLOW)->exists();
                    if (!$followAlreadySent) {
                        // Send follow request
                        GroupNotification::create([
                            'group_id' => $group->id,
                            'from_user_id' => $authUser->id,
                            'message' => NotificationController::getMessageForGroupFollow($authUser->username, $group->name),
                            'type' => GroupNotification::NOTIFICATION_TYPE_FOLLOW,
                        ]);
                        return response()->json(['status' => true, 'sent' => true]);
                    } else {
                        GroupNotification::where('from_user_id', $authUser->id)->where('group_id', $group->id)->where('type', GroupNotification::NOTIFICATION_TYPE_FOLLOW)->delete();
                    }
                } else {
                    $authUser?->group_followings()->sync($group->id);
                }
                $status = true;
            }
            return response()->json(['status' => $status]);
        } else {
            return response()->json(['status' => 'false']);
        }
    }

    public function getProfile($name)
    {
        $group = Group::where('name', $name)->first();
        if (!$group) {
            return redirect()->route('home');
        }
        $auth_user = auth()->user();
        $this->getProfileData($auth_user, $group);
        return Inertia::render('Group/Profile', ['auth_user' => auth()->user(), 'group' => $group]);
    }

    public static function getProfileData(&$user, &$group)
    {
        if (app()->call([self::class, 'isGroupUserMember'], compact('user', 'group'))) {
            $user->is_group_user_member = true;
        } else {
            $user->is_group_user_member = false;
        }
        app()->call([UserController::class, 'loadUserData'], ['user' => $user]);
        app()->call([self::class, 'loadGroupData'], ['group' => $group]);
    }

    public static function getFollowers(&$group)
    {
        if (auth()->check()) {
            $followers = $group->followers->pluck('name')->toArray();
            return $followers;
        }
        return array('You are not logged in.');
    }

    public static function getConcerts(&$group)
    {
        if (auth()->check()) {
            $concerts = $group->concerts->pluck('name')->toArray();
            return $concerts;
        }
        return array('You are not logged in.');
    }

    public static function getMembers(&$group)
    {
        if (auth()->check()) {
            $members = $group->members->pluck('name')->toArray();
            return $members;
        }
        return array('You are not logged in.');
    }

    public static function getGroupRoles(&$group)
    {
        if (auth()->check()) {
            $roles = $group->roles->pluck('name')->toArray();
            return $roles;
        }
        return array('You are not logged in.');
    }

    public static function getGroupConcertsReceivedLikes(&$group)
    {
        if (auth()->check()) {
            $concertLikesReceived = \DB::table('concert_likes')
                ->where('group_id', $group->id)
                ->pluck('concert_id')
                ->toArray();

            $group->concert_received_likes = $concertLikesReceived;

            return $concertLikesReceived;
        }
        return array('You are not logged in.');
    }

    public static function getGroupMidis(&$group)
    {
        if (auth()->check()) {
            $midis = $group->midis->pluck('midi')->toArray();
            $group->midis = $midis;
            return $midis;
        }
        return array('You are not logged in.');
    }

    public function renderGroupFollowers($name)
    {
        $auth_user = auth()->user();
        $type = 'followers';
        $group = Group::where('name', $name)->firstOrFail();
        $this->getFollowers($group);
        app()->call([UserController::class, 'loadUserData'], ['user' => $auth_user]);
        return Inertia::render('Group/Follows', compact('auth_user', 'type', 'group'));
    }

    public function renderGroupMembers($name)
    {
        $auth_user = auth()->user();
        $type = 'members';
        $group = Group::where('name', $name)->firstOrFail();
        $this->getMembers($group);
        app()->call([UserController::class, 'loadUserData'], ['user' => $auth_user]);
        return Inertia::render('Group/Follows', compact('auth_user', 'type', 'group'));
    }

    public static function hasSentFollowRequest(Request $request) {
        $group_id = $request->input('group_id');
        if ($group_id) {
            $from_user_id = Auth::id();
            return GroupNotification::where('group_id', '=', $group_id)->where('from_user_id', '=', $from_user_id)->where('type', '=', GroupNotification::NOTIFICATION_TYPE_FOLLOW)->exists();
        }
        return false;
    }

    public static function acceptFollowRequest(Request $request) {
        $from_user_id = $request->input('user_id');
        $group_id = $request->input('group_id');
        if ($from_user_id && $group_id) {
            $from_user = User::findOrFail($from_user_id);
            $user_id = Auth::id();
            $user = User::findOrFail($user_id);
            $group = Group::findOrFail($group_id);
            // Delete the from_user's follow request
            GroupNotification::where('group_id', $group_id)->where('from_user_id', $from_user_id)->where('type', GroupNotification::NOTIFICATION_TYPE_FOLLOW)->delete();
            // Send accepted follow request notification to from_user (who has requested the follow)
            UserNotification::create([
                'user_id' => $from_user_id,
                'from_user_id' => $user_id,
                'message' => NotificationController::getMessageForGroupFollowRequestAccepted($user->username, $group->name),
                'type' => GroupNotification::NOTIFICATION_TYPE_REQUEST_ACCEPTED,
            ]);
            // Add from_user as group follower
            $group->followers()->sync($from_user->id);
            // Add group as from_user following
            $from_user->group_followings()->sync($user->id);
        }
    }

    public static function deleteFollowRequest(Request $request) {
        $id = $request->input('id');
        if ($id) {
            UserNotification::findOrFail($id)->delete();
        }
    }

    public static function invitePeople(Request $request) {
        $users = json_decode($request->input('users'));
        $from_user_id = $request->input('from_user_id');
        $group_id = $request->input('group_id');
        \Illuminate\Support\Facades\Log::debug($group_id);
        $from_user = User::findOrFail($from_user_id);
        $group = Group::findOrFail($group_id);
        foreach ($users as $user) {
            // Verify if user has already been invited
            $notification = UserNotification::where('user_id', $user->id)->where('from_user_id', $from_user_id)->where('group_ref_id', $group_id)->where('type', UserNotification::NOTIFICATION_TYPE_INVITE)->exists();
            if (!$notification) {
                UserNotification::create([
                    'user_id' => $user->id,
                    'from_user_id' => $from_user_id,
                    'message' => NotificationController::getMessageForGroupInvite($from_user->username, $group->name),
                    'type' => UserNotification::NOTIFICATION_TYPE_INVITE,
                    'group_ref_id' => $group_id,
                ]);
            }
        }
    }

    public static function acceptInvite(Request $request) {
        $group_id = $request->input('group_id');
        if ($request->input('notification_id')) {
            $notification = UserNotification::findOrFail($request->input('notification_id'));
            if ($notification->group_ref_id) {
                $group_id = $notification->group_ref_id;
            }
        }
        $group = Group::findOrFail($group_id);
        $user = User::findOrFail(Auth::id());
        if ($user && $group) {
            // Delete invite request
            $user_notifications = UserNotification::where('user_id', $user->id)->where('type', UserNotification::NOTIFICATION_TYPE_INVITE)->get();
            if ($user_notifications) {
                foreach ($user_notifications as $notification) {
                    $notification->delete();
                }
            }
            // Add user to group
            $group->members()->attach($user);
            // Notify Group members
            GroupNotification::create([
                'group_id' => $group->id,
                'from_user_id' => $user->id,
                'message' => NotificationController::getNewGroupMemberMessage($user->username, $group->name),
                'type' => GroupNotification::NOTIFICATION_TYPE_REQUEST_ACCEPTED,
            ]);
        }
    }

    public static function deleteMember(Request $request) {
        $user_id = $request->input('user_id');
        $group_id = $request->input('group_id');
        if ($user_id && $group_id) {
            $group = Group::findOrFail($group_id);
            if ($group) {
                $group->members()->detach($user_id);
            }
        }
    }
}
