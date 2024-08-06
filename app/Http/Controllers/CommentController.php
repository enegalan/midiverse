<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Inertia\Inertia;


class CommentController extends Controller {

    public function show($token) {
        $comment = Comment::where('token', $token)->firstOrFail();
        $post = Post::findOrFail($comment->post_id);
        $post = UserController::getPostData($post);
        $user = User::findOrFail($comment->user_id);
        UserController::loadUserData($user);
        $auth_user = User::findOrFail(\Auth::id());
        UserController::loadUserData($auth_user);
        if ($comment) {
            $replies = Comment::where('parent_id', $comment->id)->get();
            $comment = self::getCommentData($comment);
            $repliesData = array();
            foreach ($replies as $replie) {
                $repliesData[] = self::getCommentData($replie);
            }
            return Inertia::render('CommentShow', [
                'post' => $post,
                'comment' => $comment,
                'replies' => $repliesData,
                'user' => $user,
                'auth_user' => $auth_user,
            ]);
        }
    }
    public function store(Request $request, string $token) {
        $post = Post::where('token', $token)->first();
        $request->validate([
            'parent_id' => 'nullable|exists:comments,id',
            'visibility' => 'required',
        ]);
        $token = PostController::generateNumericToken();
        $comment_id = \DB::table('comments')->insertGetId([
            'body' => $request->content ? $request->content : '',
            'user_id' => auth()->id(),
            'post_id' => $post->id,
            'parent_id' => $request->parent_id,
            'token' => $token,
            'comments_visibility' => $request->visibility,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $hashedName = \Str::random(40) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('media', $hashedName, 'public');
                \DB::table('comment_media')->insert([
                    'comment_id' => $comment_id,
                    'filename' => $hashedName,
                ]);
            }
        }
        return redirect()->back();
    }

    public function update(Request $request, string $token) {
        $request->validate([
            'visibility' => 'required',
        ]);
        $comment = Comment::where('token', $token)->firstOrFail();
        $comment->update([
            'body' => $request->body ? $request->body : '',
            'comments_visibility' => $request->visibility,
        ]);
        $prevMedia = json_decode($request->input('prev_media'), true);
        // Retrieve and delete existing media files
        $existingMedia = \DB::table('comment_media')->where('comment_id', $comment->id)->get();
        foreach ($existingMedia as $media) {
            if (!in_array($media->id, $prevMedia)) {
                \Storage::disk('public')->delete('media/' . $media->filename);
            }
        }
        // Remove existing media entries from the database
        \DB::table('comment_media')->where('comment_id', $comment->id)->whereNotIn('id', $prevMedia)->delete();
        // Upload new media
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $hashedName = \Str::random(40) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('media', $hashedName, 'public');
                \DB::table('comment_media')->insert([
                    'comment_id' => $comment->id,
                    'filename' => $hashedName,
                ]);
            }
        }

        return redirect()->back();
    }

    public function destroy(Comment $comment) {
        $this->authorize('delete', $comment);

        $comment->delete();

        return redirect()->back();
    }

    public static function like ($token) {
        if (Comment::where('token', $token)->count() === 0) return;
        $comment = Comment::where('token', $token)->first();
        $isAlreadyLiked = \DB::table('comment_likes')->where('user_id', auth()->user()->id)->where('comment_id', $comment->id)->exists();
        if (!$isAlreadyLiked) {
            \DB::table('comment_likes')->insert([
                'user_id' => auth()->user()->id,
                'comment_id' => $comment->id,
            ]);
        } else {
            \DB::table('comment_likes')->where('user_id', auth()->user()->id)->where('comment_id', $comment->id)->delete();
        }
    }

    public static function getCommentData($comment) {
        $replies = Comment::where('parent_id', $comment->id)->get();
        $user = User::findOrFail($comment->user_id);
        UserController::getProfileData($user);
        $likes = \DB::table('comment_likes')
            ->where('comment_id', $comment->id)->where('user_id', $user->id)->get()->toArray();
        $media = \DB::table('comment_media')->where('comment_id', $comment->id)->get();
        return [
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'user_id' => $comment->user_id,
            'parent_id' => $comment->parent_id,
            'body' => $comment->body,
            'created_at' => $comment->created_at,
            'updated_at' => $comment->updated_at,
            'replies' => $replies,
            'user' => $user,
            'media' => $media,
            'likes' => $likes,
            'token' => $comment->token,
            'comments_visibility' => $comment->comments_visibility,
        ];
    }

    public static function updateVisibility (Request $request) {
        $comment_id = $request->input('comment_id');
        $visibility = $request->input('visibility');
        $comment = Comment::findOrFail($comment_id);
        if ($comment && $comment->user_id == auth()->id()) {
            $comment->update(['comments_visibility' => $visibility]);
            $comment->save();
        }
    }
}
