<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DirectMessage;
use App\Events\DirectMessageSent;
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
    }
}
