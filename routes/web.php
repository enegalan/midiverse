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
        $user->roles();
        return Inertia::render('Index', compact('user'));
    })->name('home');
    
    Route::get('/explore', function () {
        $user = auth()->user();
        $user->roles();
        return Inertia::render('Explore', compact('user'));
    })->name('explore');
    
    Route::get('/concerts', function () {
        $user = auth()->user();
        $user->roles();
        return Inertia::render('Concerts', compact('user'));
    })->name('concerts');
    
    Route::get('/playground', function () {
        $user = auth()->user();
        $user->roles();
        return Inertia::render('Playground', compact('user'));
    })->name('playground');
    
    Route::get('/messages', function () {
        $user = auth()->user();
        $user->roles();
        return Inertia::render('Messages', compact('user'));
    })->name('messages');
});
Route::get('/', function () {
    if (Auth::check()) {
        return Redirect::route('home');
    }
});

// Get Data Routes
Route::get('/user/email/exists/', [UserController::class,'existsByEmail'])->name('user.exists.email');

require __DIR__ . '/auth.php';
