<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PostController;
use App\Models\Post;

class MainController extends Controller
{

    public static function rootRedirect () {
        if (auth()->check()) {
            return redirect(route('home'));
        }
    }
    public static function home () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        $recent_posts = [];
        $follows_posts = [];
        $recent_posts = app()->call([self::class, 'getRecentPosts'], compact('recent_posts'));
        $follows_posts = app()->call([UserController::class, 'getFollowsPosts'], compact('follows_posts'));
        return Inertia::render('Index', compact('user', 'recent_posts', 'follows_posts'));
    }

    public static function explore () {
        $user = $auth_user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        $posts = [];
        $posts = app()->call([self::class, 'getTopPosts'], compact('posts'));
        $top_users = app()->call([UserController::class,'getTopUsers']);
        $all_users = app()->call([UserController::class,'getAllUsers']);
        $all_groups = app()->call( [GroupController::class ,'getAll']);
        return Inertia::render('Explore', compact('auth_user', 'top_users', 'posts', 'all_users', 'all_groups'));
    }

    public static function concerts () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Concerts', compact('user'));
    }

    public static function playground () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Playground', compact('user'));
    }

    public static function messages () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Messages', compact('user'));
    }

    public static function profileRedirect () {
        return redirect('/u/' . auth()->user()->username);
    }

    public static function getRecentPosts (&$recent_posts) {
        $recent_posts = Post::orderBy('created_at','desc')->get();
        $recent_posts = $recent_posts->map(function ($post) {
            return [
                'id' => $post->id,
                'user' => [
                    'avatar' => $post->user->avatar,
                    'name' => $post->user->name,
                    'lastname' => $post->user->lastname,
                    'username' => $post->user->username,
                ],
                'content' => $post->content,
                'date' => $post->created_at->toDateString(),
                'comments' => $post->comments->count(),
                'likes' => $post->likes->count(),
            ];
        });
        return $recent_posts;
    }

    public static function getTopPosts (&$posts) {
        $posts = Post::orderBy('created_at','desc')->get();
        $topPosts = [];
        foreach ($posts as $post) {
            $likeCount = \DB::table('post_likes')->where('post_id', $post->id)->count();
            // Assign the like count to the post object
            $post->like_count = $likeCount;
            $post->load('user');
            // Store the post in the array if it has likes
            if ($likeCount > 0) {
                $topPosts[] = $post;
            }
        }
        if (count($topPosts) > 0) {
            usort($topPosts, function ($a, $b) {
                return $b->like_count <=> $a->like_count;
            });  
        }
        return $topPosts;
    }
}
