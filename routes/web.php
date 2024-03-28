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

// Redirection for /
// TODO: Redirect to auth it's not logged
Route::get('/', function () {
    return redirect('/home');
})->name('index');

Route::get('/home', function () {
    return Inertia::render('Index');
})->name('home');

Route::get('/explore', function () {
    return Inertia::render('Explore');
})->name('explore');

Route::get('/concerts', function () {
    return Inertia::render('Concerts');
})->name('concerts');

require __DIR__ . '/auth.php';
