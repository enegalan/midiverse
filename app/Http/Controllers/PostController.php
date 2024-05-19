<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller {
    public function show($token) {
        $post = Post::where('token', $token)->first();
        $comments = array();
        $post_comments = \DB::table('comments')->where('post_id', $post->id)->orderByDesc('id')->get();
        foreach ($post_comments as $comment) {
            $comments[] = CommentController::getCommentData($comment);
        }
        $post = UserController::getPostData($post);
        $user = Auth::user();
        UserController::getProfileData($user);
        return Inertia::render('PostShow', [
            'post' => $post,
            'comments' => $comments,
            'user' => $user,
        ]);
    }
    
    public static function store (Request $request) {
        $content = $request->input('content');
        $user_id = auth()->user()->id;
        $token = self::generateNumericToken();
        Post::createOrFirst([
            'content'=> $content,
            'user_id'=> $user_id,
            'token'=> $token,
        ]);
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
}
