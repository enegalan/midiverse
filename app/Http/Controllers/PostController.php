<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public static function store (Request $request) {
        $content = $request->input('content');
        $user_id = auth()->user()->id;
        Post::createOrFirst([
            'content'=> $content,
            'user_id'=> $user_id,
        ]);
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
