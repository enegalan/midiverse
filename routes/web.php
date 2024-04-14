<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MainController;
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
    Route::get('/home', [MainController::class, 'home'])->name('home');
    
    Route::get('/explore', [MainController::class, 'explore'])->name('explore');
    
    Route::get('/concerts', [MainController::class, 'concerts'])->name('concerts');
    
    Route::get('/playground', [MainController::class, 'playground'])->name('playground');
    
    Route::get('/messages', [MainController::class, 'messages'])->name('messages');

    Route::get('/u/{username}', [UserController::class, 'getProfile'])->name('profile');

    Route::get('/profile', [MainController::class, 'profileRedirect']);

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
    Route::post('/group/edit/{name}', [GroupController::class,'update'])->name('groups.update');
    Route::delete('/group/delete/{name}', [GroupController::class,'delete'])->name('group.delete');
    Route::get('/g/{name}', [GroupController::class,'getProfile'])->name('group.profile');

    // Posts
    Route::post('/post/create', [PostController::class,'store'])->name('post.create');
    Route::post('/post/like/{id}', [PostController::class, 'like'])->name('post.like');
});
Route::get('/', [MainController::class, 'rootRedirect']);

// Get Data Routes
Route::get('/user/email/exists/', [UserController::class,'existsByEmail'])->name('user.exists.email');
Route::get('/user/following/{username}', [UserController::class, 'isFollowing'])->name('user.is.following');
Route::get('/group/name/exists/', [GroupController::class, 'existsByName'])->name('group.exists.name');
Route::get('/group/following/{name}', [GroupController::class, 'isFollowing'])->name('group.exists.name');

// Follow
Route::post('/user/follow/{username}', [UserController::class,'toggleFollow'])->name('user.follow');
Route::post('/group/follow/{name}', [GroupController::class,'toggleFollow'])->name('group.follow');

require __DIR__ . '/auth.php';
