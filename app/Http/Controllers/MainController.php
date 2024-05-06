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
        app()->call([UserController::class,'loadUserData'], compact('user'));
        $recent_posts = [];
        $follows_posts = [];
        $recent_posts = app()->call([self::class, 'getRecentPosts'], compact('recent_posts'));
        $follows_posts = app()->call([UserController::class, 'getFollowsPosts'], compact('follows_posts'));
        return Inertia::render('Index', compact('user', 'recent_posts', 'follows_posts'));
    }

    public static function explore () {
        $user = $auth_user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        $posts = [];
        $posts = app()->call([self::class, 'getTopPosts'], compact('posts'));
        $top_users = app()->call([UserController::class,'getTopUsers']);
        $all_users = app()->call([UserController::class,'getAllUsers']);
        $all_groups = app()->call( [GroupController::class ,'getAll']);
        return Inertia::render('Explore', compact('auth_user', 'top_users', 'posts', 'all_users', 'all_groups'));
    }

    public static function concerts () {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Concerts', compact('user'));
    }

    public static function playground () {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Playground', compact('user'));
    }

    public static function messages () {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Messages', compact('user'));
    }

    public static function profileRedirect () {
        return redirect('/u/' . auth()->user()->username);
    }

    public static function getRecentPosts (&$recent_posts) {
        $recent_posts = Post::orderBy('created_at','desc')->get();
        $recent_posts = $recent_posts->sortByDesc('created_at')->map(function ($post) {
            $post->load('user');
            return [
                'id' => $post->id,
                'user' => [
                    'id' => $post->user->id,
                    'avatar' => $post->user->avatar,
                    'name' => $post->user->name,
                    'lastname' => $post->user->lastname,
                    'username' => $post->user->username,
                    'private' => $post->user->private,
                ],
                'content' => $post->content,
                'date' => $post->created_at->toDateString(),
                'comments' => $post->comments,
                'comments_count' => $post->comments->count(),
                'likes' => $post->likes,
                'likes_count' => $post->likes->count(),
            ];
        });
        $filteredRecentPosts = array();
        foreach ($recent_posts as &$recent_post) {
            $validatedPost = app()->call([self::class, 'validateUserPosts'], array('user' => $recent_post['user']));
            if ($validatedPost) {
                $filteredRecentPosts[] = $recent_post;
            }
        }
        return $filteredRecentPosts;
    }

    public static function getTopPosts (&$posts) {
        $posts = Post::orderBy('created_at','desc')->get();
        $topPosts = [];
        foreach ($posts as $post) {
            $likes = \DB::table('post_likes')->where('post_id', $post->id)->get();
            // Assign the like count to the post object
            $post->like_count = $likes->count();
            $post->likes = $likes;
            $post->load('user', 'comments');
            $validatedPost = app()->call([self::class, 'validateUserPosts'], array('user' => $post->user));
            // Store the post in the array if it has likes and it is validated
            if ($likes->count() > 0 && $validatedPost) {
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

    public static function validateUserPosts($user) {
        $isUserObj = is_object($user);
        $userId = null;
        $userId = $isUserObj ? $user->id : $user['id'];
        $userUsername = $isUserObj ? $user->username : $user['username'];
        $userPrivate = $isUserObj ? $user->private : $user['private'];
        $isAuthUserFollowingJson = app()->call([UserController::class, 'isFollowing'], array('username' => $userUsername));
        $isAuthUserFollowing = json_decode($isAuthUserFollowingJson, true);
        // If user is public OR
        // If post user is auth user OR
        // If auth user is following post user
        if ($userPrivate == 0 || 
        $userId == auth()->user()->id || 
        $isAuthUserFollowing['status'] == true) {
            return true;
        }
        return false;
    }
}
