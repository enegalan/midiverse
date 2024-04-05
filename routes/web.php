<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Index', compact('user'));
    })->name('home');
    
    Route::get('/explore', function () {
        $user = $auth_user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        $top_users = app()->call([UserController::class,'getTopUsers']);
        $all_users = app()->call([UserController::class,'getAllUsers']);
        $all_groups = app()->call( [GroupController::class ,'getAll']);
        return Inertia::render('Explore', compact('auth_user', 'top_users', 'all_users', 'all_groups'));
    })->name('explore');
    
    Route::get('/concerts', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Concerts', compact('user'));
    })->name('concerts');
    
    Route::get('/playground', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Playground', compact('user'));
    })->name('playground');
    
    Route::get('/messages', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        app()->call([UserController::class, 'getGroups'], compact('user'));
        return Inertia::render('Messages', compact('user'));
    })->name('messages');

    Route::get('/u/{username}', [UserController::class, 'getProfile'])->name('profile');

    Route::get('/profile', function () {
        return redirect('/u/' . auth()->user()->username);
    });

    // Follows
    Route::get('/u/{username}/following', [UserController::class,'renderUserFollowings'])->name('render.user.following');
    Route::get('/u/{username}/followers', [UserController::class,'renderUserFollowers'])->name('render.user.followers');
    Route::get('/g/{name}/followers', [GroupController::class,'renderGroupFollowers'])->name('render.group.followers');
    Route::get('/g/{name}/members', [GroupController::class,'renderGroupMembers'])->name('render.group.members');

    // Store Midi
    Route::post('/midi/create', [UserController::class,'storeMidi'])->name('store.midi');
    
    // Groups
    Route::get('/groups', [UserController::class,'renderGroups'])->name('render.groups');
    Route::post('/group/create', [GroupController::class,'store'])->name('groups.store');
    Route::get('/g/{name}', [GroupController::class,'getProfile'])->name('group.profile');
});
Route::get('/', function () {
    if (Auth::check()) {
        return Redirect::route('home');
    }
});

// Get Data Routes
Route::get('/user/email/exists/', [UserController::class,'existsByEmail'])->name('user.exists.email');
Route::get('/user/following/{username}', [UserController::class, 'isFollowing'])->name('user.is.following');
Route::get('/group/name/exists/', [GroupController::class, 'existsByName'])->name('group.exists.name');
Route::get('/group/following/{name}', [GroupController::class, 'isFollowing'])->name('group.exists.name');

// Follow
Route::post('/user/follow/{username}', [UserController::class,'toggleFollow'])->name('user.follow');
Route::post('/group/follow/{name}', [GroupController::class,'toggleFollow'])->name('group.follow');

require __DIR__ . '/auth.php';
