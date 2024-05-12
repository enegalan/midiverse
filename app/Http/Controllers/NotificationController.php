<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserNotification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller {
    public static function getUnreadNotificationsCount(&$user = null) {
        $unreadNotifications = UserNotification::where('user_id', '=', Auth::id())->where('viewed', '=', 0)->count();
        if ($user) {
            $user->unread_notifications = $unreadNotifications;
        }
        return $unreadNotifications;
    }

    public static function getNotifications(&$user = null) {
        $notifications = UserNotification::where('user_id', '=', Auth::id())->orderByDesc('id')->get();
        foreach ($notifications as &$notification) {
            $from_user = User::findOrFail($notification->from_user_id);
            $notification->from_user = $from_user;
        }
        if ($user) {
            $user->notifications = $notifications;
        }
        return $notifications;
    }

    public static function getMessageForFollow($username) {
        return $username . ' has sent you a follow request.';
    }

    public static function getMessageForFollowRequestAccepted($username) {
        return $username . ' has accepted your follow request.';
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
}
