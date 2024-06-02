<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DirectMessage;
use App\Events\DirectMessageSent;
use App\Models\UserNotification;
use App\Models\User;
use Inertia\Inertia;

class DirectMessageController extends Controller {
    public function __construct() {
        $this->middleware('auth');
    }
    public function store(Request $request) {
        $mediaPath = null;
        if ($request->hasFile('media')) {
            $mediaFiles = $request->file('media');
            foreach ($mediaFiles as $file) {
                $hashedName = \Str::random(40) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('media', $hashedName, 'public');
                $mediaPath = $filePath;
            }
        }
        $message = DirectMessage::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'media' => $mediaPath,
        ]);
        broadcast(new DirectMessageSent($message));
        $authUser = User::findOrFail(auth()->id());
        $receiver = User::findOrFail($request->receiver_id);
        $snoozedUsers = UserController::getSnoozedUsers($receiver);
        $isSnoozed = false;
        foreach ($snoozedUsers as $snoozedUser) {
            if ($snoozedUser->id == $authUser->id) {
                $isSnoozed = true;
                break;
            }
        }
        if (!$isSnoozed) {
            // Send notification
            UserNotification::create([
                'user_id' => $request->receiver_id,
                'from_user_id' => $authUser->id,
                'message' => NotificationController::getMessageForDirectMessage($authUser->username),
                'type' => UserNotification::NOTIFICATION_TYPE_DIRECT_MESSAGE,
            ]);
        }
    }
}
