<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserNotification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller
{
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
}
