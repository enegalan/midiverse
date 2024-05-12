<?php

namespace App\Http\Controllers;

use App\Models\GroupNotification;
use Illuminate\Http\Request;
use App\Models\UserNotification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller {
    public static function getUnreadNotificationsCount(&$user = null) {
        $user_group_ids = UserController::getUserGroupIds();
        $unreadUserNotifications = UserNotification::where('user_id', Auth::id())->where('viewed', 0)->count();
        $unreadGroupNotifications = GroupNotification::whereIn('group_id', $user_group_ids)->where('viewed', 0)->count();
        $unreadNotifications = $unreadUserNotifications + $unreadGroupNotifications;
        if ($user) {
            $user->unread_notifications = $unreadNotifications;
        }
        return $unreadNotifications;
    }

    public static function getNotifications(&$user = null) {
        $user_notifications = UserNotification::where('user_id', '=', Auth::id())->orderByDesc('id')->get();
        foreach ($user_notifications as &$user_notification) {
            $from_user = User::findOrFail($user_notification->from_user_id);
            $user_notification->from_user = $from_user;
        }
        $user_group_ids = UserController::getUserGroupIds($user);
        if (!empty($user_group_ids)) {
            $group_notifications = GroupNotification::whereIn('group_id', $user_group_ids)->orderByDesc('id')->get();
            foreach ($group_notifications as &$group_notification) {
                $from_user = User::findOrFail($group_notification->from_user_id);
                $group_notification->from_user = $from_user;
            }
        }
        if (isset($group_notifications)) {
            $notifications = $group_notifications->merge($user_notifications);
        } else {
            $notifications = $user_notifications;
        }
        if ($user) {
            $user->notifications = $notifications;
        }
        return $notifications;
    }

    public static function getMessageForFollow($username) {
        return $username . ' has sent you a follow request.';
    }

    public static function getMessageForGroupFollow($username, $group_name) {
        return $username . ' has sent a follow request to ' . $group_name . ' group.';
    }
    public static function getMessageForFollowRequestAccepted($username) {
        return $username . ' has accepted your follow request.';
    }

    public static function getMessageForGroupFollowRequestAccepted($username, $group_name) {
        return $username . ' has accepted your follow request to ' . $group_name . ' group.';
    }

    public static function getMessageForLike($username, $entity_name) {
        return $username . ' liked your ' . $entity_name;
    }

    public static function getMessageForBookmark($username, $entity_name) {
        return $username . ' bookmarked your ' . $entity_name;
    }

    public static function getMessageForComment($username, $entity_name) {
        return $username . ' has commented in your ' . $entity_name;
    }

    public static function getMessageForRol($username, $group_name, $rol_name) {
        return $username . ' has assigned you ' . $rol_name . ' role in the ' . $group_name . ' group.';
    }

    public static function getMessageForGroupInvite($username, $group_name) {
        return $username . ' has invited you to join to ' . $group_name . ' group.';
    }

    public static function getNewGroupMemberMessage($username, $group_name) {
        return $username . ' has joined as member of ' . $group_name . ' group.';
    }
}
