<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\User;

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
            $isGroupMember = $this->isGroupUserMember(auth()->user());
            if ($group && !$isGroupMember) {
                $isFollowing = \DB::table('group_followers')
                    ->where('group_id', $group->id)
                    ->where('follower_id', auth()->user()->id)
                    ->exists();
                return response()->json(['status' => $isFollowing]);
            } else {
                return response()->json(['status' => null]);
            }
        } else {
            return response()->json(['status' => false]);
        }
    }
    public static function getAll() {
        return Group::all();
    }

    public static function isGroupUserMember($user) {
        return \DB::table('group_members')->where('user_id', $user['id'])->exists();
    }

    public function toggleFollow($name) {
        $group = Group::where('name', $name)->first();
        $isGroupMember = $this->isGroupUserMember(auth()->user());
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
}
