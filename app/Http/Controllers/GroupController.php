<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;

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
            $authUserId = auth()->id();
            if ($group && $group->user_id !== $authUserId) {
                $isFollowing = \DB::table('group_followers')
                    ->where('group_id', $group->id)
                    ->where('follower_id', $authUserId)
                    ->exists();
                return response()->json(['status' => $isFollowing]);
            } else {
                return response()->json(['status' => false]);
            }
        } else {
            return response()->json(['status' => false]);
        }
    }
}
