<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller {
    public function show($token) {
        $post = Post::where('token', $token)->firstOrFail();
        $comments = array();
        $post_comments = \DB::table('comments')->where('post_id', $post->id)->orderByDesc('id')->get();
        foreach ($post_comments as $comment) {
            $comments[] = CommentController::getCommentData($comment);
        }
        $user = User::findOrFail($post->user_id);
        $post = UserController::getPostData($post);
        $auth_user = Auth::user();
        UserController::getProfileData($user);
        UserController::getProfileData($auth_user);
        return Inertia::render('PostShow', [
            'post' => $post,
            'comments' => $comments,
            'user' => $user,
            'auth_user' => $auth_user,
        ]);
    }
    
    public static function store (Request $request) {
        $content = $request->input('content');
        $visibility = $request->input('visibility');
        $user_id = auth()->user()->id;
        $token = self::generateNumericToken();
        if (!$content) {
            $content = '';
        }
        $post = Post::createOrFirst([
            'content'=> $content,
            'user_id'=> $user_id,
            'token'=> $token,
            'comments_visibility' => $visibility,
        ]);

        if ($request->hasFile('media')) {
            $mediaFiles = $request->file('media');
            foreach ($mediaFiles as $file) {
                $hashedName = \Str::random(40) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('media', $hashedName, 'public');
                \DB::table('post_media')->insert([
                    'post_id' => $post->id,
                    'filename' => $hashedName,
                ]);
            }
        }
    }

    public static function update (Request $request) {
        $content = $request->input('content') ? $request->input('content') : '';
        $visibility = $request->input('visibility');
        $post_id = $request->input('post_id');
        $post = Post::findOrFail($post_id);
        if ($post && $post->user_id == auth()->id()) {
            $post->update([
                'content' => $content,
                'comments_visibility' => $visibility,
            ]);
            $prevMedia = json_decode($request->input('prev_media'), true);
            // Retrieve and delete existing media files
            $existingMedia = \DB::table('post_media')->where('post_id', $post_id)->get();
            foreach ($existingMedia as $media) {
                if (!in_array($media->id, $prevMedia)) {
                    \Storage::disk('public')->delete('media/' . $media->filename);
                }
            }
            // Remove existing media entries from the database
            \DB::table('post_media')->where('post_id', $post_id)->whereNotIn('id', $prevMedia)->delete();
            // Upload new media
            if ($request->hasFile('media')) {
                foreach ($request->file('media') as $file) {
                    $hashedName = \Str::random(40) . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('media', $hashedName, 'public');
                    \DB::table('post_media')->insert([
                        'post_id' => $post_id,
                        'filename' => $hashedName,
                    ]);
                }
            }
        }
        return redirect()->back();
    }

    public static function generateNumericToken($length = 8) {
        $token = '';
        for ($i = 0; $i < $length; $i++) {
            $token .= random_int(0, 9);
        }
        return $token;
    }

    public static function like ($id) {
        if (Post::findOrFail($id)->count() === 0) return;
        $isAlreadyLiked = \DB::table('post_likes')->where('user_id', auth()->user()->id)->where('post_id', $id)->exists();
        if (!$isAlreadyLiked) {
            \DB::table('post_likes')->insert([
                'user_id' => auth()->user()->id,
                'post_id' => $id,
            ]);
        } else {
            \DB::table('post_likes')->where('user_id', auth()->user()->id)->where('post_id', $id)->delete();
        }
    }

    public static function delete ($token) {
        $post = Post::where('token', $token)->first();
        if ($post) {
            $commentIds = $post->comments()->pluck('id')->toArray();
            \DB::table('comment_likes')->whereIn('comment_id', $commentIds)->delete();
            $post->comments()->delete();
            \DB::table('post_likes')->where('post_id', $post->id)->delete();
            $post->midi()->delete();
            $post->delete();
        }
    }

    public static function updateCommentsVisibility (Request $request) {
        $post_id = $request->input('post_id');
        $visibility = $request->input('visibility');
        $post = Post::findOrFail($post_id);
        if ($post && $post->user_id == auth()->id()) {
            $post->update(['comments_visibility' => $visibility]);
            $post->save();
        }
    }
}
