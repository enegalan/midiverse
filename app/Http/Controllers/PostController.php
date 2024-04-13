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
}
