<?php

use App\Http\Controllers\UserController;
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
        return Inertia::render('Index', compact('user'));
    })->name('home');
    
    Route::get('/explore', function () {
        $user = $auth_user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        $top_users = app()->call([UserController::class,'getTopUsers']);
        $all_users = app()->call([UserController::class,'getAllUsers']);
        return Inertia::render('Explore', compact('auth_user', 'top_users', 'all_users'));
    })->name('explore');
    
    Route::get('/concerts', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        return Inertia::render('Concerts', compact('user'));
    })->name('concerts');
    
    Route::get('/playground', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        return Inertia::render('Playground', compact('user'));
    })->name('playground');
    
    Route::get('/messages', function () {
        $user = auth()->user();
        app()->call([UserController::class, 'getRoles'], compact('user'));
        return Inertia::render('Messages', compact('user'));
    })->name('messages');

    Route::get('/u/{username}', [UserController::class, 'getProfile'])->name('profile');

    Route::get('/profile', function () {
        return redirect('/u/' . auth()->user()->username);
    });

    Route::get('/u/{username}/following', [UserController::class,'renderUserFollowings'])->name('render.user.following');
    Route::get('/u/{username}/followers', [UserController::class,'renderUserFollowers'])->name('render.user.followers');

    // Store Midi
    Route::post('/midi/create', [UserController::class,'storeMidi'])->name('store.midi');
});
Route::get('/', function () {
    if (Auth::check()) {
        return Redirect::route('home');
    }
});

// Get Data Routes
Route::get('/user/email/exists/', [UserController::class,'existsByEmail'])->name('user.exists.email');
Route::get('/user/following/{username}', [UserController::class, 'isFollowing'])->name('user.is.following');

// Follow
Route::post('/user/follow/{username}', [UserController::class,'toggleFollow'])->name('user.follow');

require __DIR__ . '/auth.php';
