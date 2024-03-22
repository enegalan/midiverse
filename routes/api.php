<?php

use App\Models\Cart;
use App\Models\Fact_address;
use App\Models\Order;
use App\Models\User;
use App\Models\Ship_address;
use App\Models\Invoice;
use App\Models\Stock_cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
