<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    public static function getTopGroups() {
        $limit = 10;
        return Group::withCount('followers')
        ->orderByDesc('followers_count')
        ->limit($limit)
        ->get();
    }

    public static function existsByName(Request $request) {
        $name = $request->input('name');
        $group = Group::where('name', $name)->first();
        if ($group) {
            return response()->json(['status' => 'true']);
        }
        return response()->json(['status' => 'false']);
    }

    public static function store(Request $request) {
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
        \DB::table('group_members')->insert(['group_id' => $created_group['id'], 'user_id' => auth()->user()->id]);
    }

    public function isFollowing($name) {
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
    public static function getAll() {
        return Group::all();
    }

    public static function isGroupUserMember($user, $group) {
        return \DB::table('group_members')->where('user_id', $user['id'])->where('group_id', $group['id'])->exists();
    }

    public function toggleFollow($name) {
        $group = Group::where('name', $name)->first();
        $isGroupMember = $this->isGroupUserMember(auth()->user(), $group);
        if (auth()->check() &&  $group && !$isGroupMember) {
            $authUser = auth()->user();
            $isFollowing = $authUser->group_followings->contains($group);
            if ($isFollowing) {
                $authUser->group_followings()->detach($group->id);
                $status = false;
            } else {
                $authUser->group_followings()->attach($group->id);
                $status = true;
            }
            return response()->json(['status' => $status]);
        } else {
            return response()->json(['status'=> 'false']);
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

    public static function getProfileData(&$user, &$group) {
        if (app()->call([self::class, 'isGroupUserMember'], compact('user', 'group'))) {
            $user->is_group_user_member = true;
        } else {
            $user->is_group_user_member = false;
        }
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getFollowers'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        app()->call([self::class, 'getFollowers'], compact('group'));
        app()->call([self::class, 'getGroupConcertsReceivedLikes'], compact('group'));
        app()->call([self::class, 'getGroupMidis'], compact('group'));
        app()->call([self::class,'getConcerts'], compact('group'));
        app()->call([self::class,'getMembers'], compact('group'));
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

    public static function getMembers (&$group) {
        if (auth()->check()) {
            $members = $group->members->pluck('name')->toArray();
            return $members;
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

    public function renderGroupFollowers ($name) {
        $auth_user = auth()->user();
        $type = 'followers';
        $group = Group::where('name', $name)->firstOrFail();
        $this->getFollowers($group);
        return Inertia::render('Group/Follows', compact('auth_user', 'type', 'group'));
    }

    public function renderGroupMembers ($name) {
        $auth_user = auth()->user();
        $type = 'members';
        $group = Group::where('name', $name)->firstOrFail();
        $this->getMembers($group);
        return Inertia::render('Group/Follows', compact('auth_user','type','group'));
    }
}
