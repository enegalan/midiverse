<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Inertia\Inertia;


class CommentController extends Controller {

    public function show($token) {
        $comment = Comment::where('token', $token)->first();
        $post = Post::findOrFail($comment->post_id);
        $user = User::findOrFail($comment->user_id);
        UserController::loadUserData($user);
        $auth_user = \Auth::user();
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
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id'
        ]);
        $token = PostController::generateNumericToken();
        \DB::table('comments')->insert([
            'body' => $request->content,
            'user_id' => auth()->id(),
            'post_id' => $post->id,
            'parent_id' => $request->parent_id,
            'token' => $token,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Comment $comment) {
        $this->authorize('update', $comment);

        $request->validate([
            'body' => 'required|string',
        ]);

        $comment->update([
            'body' => $request->body,
        ]);

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
            'likes' => $likes,
            'token' => $comment->token,
        ];
    }
}
