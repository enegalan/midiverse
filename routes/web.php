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
        return Inertia::render('Index', compact('user'));
    })->name('home');
    
    Route::get('/explore', function () {
        return Inertia::render('Explore');
    })->name('explore');
    
    Route::get('/concerts', function () {
        return Inertia::render('Concerts');
    })->name('concerts');
    
    Route::get('/playground', function () {
        return Inertia::render('Playground');
    })->name('playground');
    
    Route::get('/messages', function () {
        return Inertia::render('Messages');
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
