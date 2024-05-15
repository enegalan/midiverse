<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Invitation;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvitationController extends Controller
{

    public static function getParsedInviteUrl($entity_name)
    {
        return env('APP_URL') . '/' . $entity_name . '/invite/' . \Str::random(\random_int(10, 25));
    }
    public static function verifyInvitation($entity_name, $token)
    {
        if (!$token) {
            return false;
        }

        $url = env('APP_URL') . '/' . $entity_name . '/invite/' . $token;
        $invitation = Invitation::where('url', $url)->first();
        if ($invitation && $invitation->user_id != Auth::id()) {
            $createdAt = strtotime($invitation->created_at);
            $twoDaysAgo = strtotime('-2 days');
            if ($createdAt >= $twoDaysAgo && $createdAt <= time()) {
                return $invitation;
            }
        }
        return false;
    }
    public static function generateGroupInvite(Request $request) {
        $group_id = $request->input('group_id');
        $user_id = Auth::id();
        $url = '';
        if ($group_id && $user_id) {
            $twoDaysAgo = now()->subDays(2);
            $existingInvitation = Invitation::where('group_id', $group_id)
                ->where('user_id', $user_id)
                ->where('created_at', '>=', $twoDaysAgo)
                ->first();
            if ($existingInvitation) {
                $url = $existingInvitation->url;
            } else {
                $url = self::getParsedInviteUrl('group');
                Invitation::create([
                    'url' => $url,
                    'group_id' => $group_id,
                    'user_id' => $user_id,
                ]);
            }
        }
        return response()->json($url);
    }

    public static function acceptGroupInvite($token)
    {
        if ($token) {
            if (Auth::check()) {
                $invitation = self::verifyInvitation('group', $token);
                if ($invitation) {
                    $user = Auth::user();
                    // Add user to group
                    $group_id = $invitation->group_id;
                    if ($group_id) {
                        $group = Group::findOrFail($group_id);
                        if (!$group->members()->where('user_id', $user->id)->exists()) {
                            $group->members()->attach($user->id);
                            $groupMemberRoleId = Role::ROLE_GROUP_MEMBER;
                            \DB::table('group_roles')->insert(['role_id' => $groupMemberRoleId, 'group_id' => $group_id, 'user_id' => $user->id]);
                            return app()->call([GroupController::class, 'getProfile'], array('name' => $group->name));
                        }
                    }
                }
            } else {
                return redirect()->route('login');
            }
        }
        return redirect()->route('home');
    }
}
