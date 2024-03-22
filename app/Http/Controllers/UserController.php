<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment_method;
use App\Models\Product;
use App\Models\Prod_comb;
use App\Models\Stock_cart;
use App\Models\User;
use App\Models\Wishlist;
use Exception;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Image as Image;
use App\Models\Color;
use App\Models\Material;
use phpseclib\Net\SSH2;
use PHPSTL\Reader\STLReader;
use PHPSTL\Handler\VolumeHandler;
use PHPSTL\Model\STLModel;
use PHPSTL\Model\Facet;
use PHPSTL\Model\Vertex;

class UserController extends Controller
{
    private $productPerPagination = 15;
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $this->getRoles();
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function avatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        $avatar = $request->file('avatar');

        $avatarName = $avatar->hashName();
        $avatar->storeAs('avatars', $avatarName, 'public');

        // Delete the previous avatar if it exists
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

        $user->avatar = $avatarName;
        $user->save();

        return redirect()->route('profile.edit')->with('status', 'Avatar uploaded successfully.');
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
            $user->avatar = null;
            $user->save();
        }

        return back()->with('status', 'Avatar deleted successfully.');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public static function getRoles()
    {
        if (auth()->check()) {
            $roles = auth()->user()->roles->pluck('name')->toArray();
            return $roles;
        }
        return array('You are not logged in.');
    }

    public function restore($id)
    {
        $user = User::withTrashed()->find($id);

        if ($user) {
            $user->restore();
        } else {
            abort('402', 'User not found');
        }
    }
    public function dashboard()
    {
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        $orders = $this->getOrders(false, true);
        $wishlist = $this->getWishlistProducts();
        return Inertia::render('Profile/Show', compact('user', 'orders', 'wishlist'));
    }

    public function getProducts()
    {
        if (auth()->check()) {
            $userId = auth()->user()->id;

            // Search users carts that are active = 0
            $userCarts = Cart::where('user_id', $userId)
                ->where('active', 0)
                ->get();

            // Search carts that are in orders and status = "Paid"
            $userCartIds = $userCarts->pluck('id');

            // Find cart IDs in orders with status = "Paid"
            $paidOrderCartIds = Order::whereIn('cart_id', $userCartIds)
                ->where('status', 'Paid')
                ->pluck('cart_id');

            // Combine the cart IDs from both steps and get unique cart IDs
            $combinedCartIds = $userCartIds->merge($paidOrderCartIds)->unique();

            // Get prod_comb_id
            $prodCombIds = Stock_cart::whereIn('cart_id', $combinedCartIds)->pluck('prod_comb_id');

            if ($prodCombIds->isNotEmpty()) {
                // Get product_id from prod_combs
                $productIds = Prod_comb::whereIn('id', $prodCombIds)->pluck('product_id');

                // Check if there are any product_ids
                if ($productIds->isNotEmpty()) {
                    $products = [];

                    // Get products from the combined carts
                    foreach ($productIds as $id) {
                        $product = Product::where('id', $id)->get();
                        array_push($products, $product);
                    }

                    //echo var_dump($products);
                    return $products;
                }
            }
        }

    }
    public function orders()
    {
        $orders = $this->getOrders(true, false);
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        return Inertia::render('Profile/Orders', ['user' => $user, 'orders' => $orders]);
    }
    public function getOrders(bool $paginate = false, bool $activeCart = true)
    {
        if (auth()->check()) {
            $userId = auth()->user()->id;
            if (!$activeCart) {
                $userCarts = Cart::where('user_id', $userId)
                    ->where('active', 0)
                    ->get();
            } else {
                $userCarts = Cart::where('user_id', $userId)
                    ->where('active', 1)
                    ->get();
            }
            $userCartIds = $userCarts->pluck('id');

            // Search users carts that are active = 0
            if ($paginate) {
                $userOrders = Order::whereIn('cart_id', $userCartIds)
                    ->paginate($this->productPerPagination);
            } else {
                $userOrders = Order::whereIn('cart_id', $userCartIds)
                    ->get();
            }
            return $userOrders;
        }
    }
    public function getWishlistProducts()
    {
        if (auth()->check()) {
            $userId = auth()->user()->id;
            $userWishlist = Wishlist::where('user_id', $userId)->first();
            if ($userWishlist) {
                $products = $userWishlist->products;
                return $products;
            }
        }
        return [];
    }

    public function wishlist()
    {
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        $wishlist = $this->getWishlistProducts();
        return Inertia::render('Profile/Wishlist', ['user' => $user, 'products' => $wishlist]);
    }

    public function addProductToWishlist(Request $request, Product $product)
    {
        // Get user_id
        $userId = auth()->user()->id;

        // Create a wishlist if the user does not have one yet
        $wishlist = Wishlist::where('user_id', $userId)->first();
        if (!$wishlist) {
            $wishlist = new Wishlist();
            $wishlist->user_id = $userId;
            $wishlist->save();
        }

        if ($this->getProductWishlistStatus($product->id)) {
            // If the product is already in the wishlist, remove it
            $wishlist->products()->detach($product->id);
        } else {
            // If the product is not in the wishlist, add it
            $wishlist->products()->attach($product->id);
        }
    }

    public function deleteProductFromWishlist(Request $request, Product $product)
    {
        $user = auth()->user();
        // Get user's wishlist
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        if ($wishlist) {
            $wishlist->products()->detach($product->id);
        }
    }

    /*
    Function to get if a product is in the user's wishlist or not
     */
    public function getProductWishlistStatus($productId)
    {
        $user = auth()->user();

        // Check if the user has a wishlist
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        if ($wishlist) {
            // Check if the product is in the wishlist
            $isInWishlist = $wishlist->products()->where('product_id', $productId)->exists() ? true : false;
        } else {
            // If the user doesn't have a wishlist, the product is not in the wishlist
            $isInWishlist = false;
        }

        return $isInWishlist;
    }

    public function viewOrder(Request $request, Order $order)
    {
        $this->getRoles();
        // Get the cart_id
        $cartId = $order->cart_id;

        // Get the stock_cart
        $stockCart = Stock_cart::where('cart_id', $cartId)->get();

        if ($stockCart->isEmpty()) {
            return response()->json(['error' => 'Stock_cart not found'], 404);
        }

        $products = [];

        foreach ($stockCart as $sc) {
            // Get the prod_comb_id of the stock_cart
            $prodCombId = $sc->prod_comb_id;

            // Get the prod_comb
            $prodCombination = Prod_comb::find($prodCombId);

            // Check if prod_combination is found
            if (!$prodCombination) {
                // Handle the case when prod_combination is not found
                return response()->json(['error' => 'Prod_comb not found'], 404);
            }

            $productId = $prodCombination->product_id;

            // Get the product
            $product = Product::find($productId);

            $productName = $product->name;

            $productFile = $product->file;

            $productImage = $product->image;

            $productPrice = $product->price;

            $colorName = $prodCombination->color->name;

            $materialName = $prodCombination->material->name;

            $products[] = [
                'orderId' => $order->id,
                'id' => $productId,
                'name' => $productName,
                'colorName' => $colorName,
                'materialName' => $materialName,
                'file' => $productFile,
                'image' => $productImage,
                'price' => $productPrice,
                'amount' => $sc->quantity,
            ];
        }

        $existingProducts = [];

        // Add the new products to the existing array
        $existingProducts = array_merge($existingProducts, $products);

        return Inertia::render('Profile/viewOrder', ['products' => $existingProducts]);
    }

    public function payments()
    {
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        $payments = Payment_method::where('user_id', $user->id)->get();
        return Inertia::render('Profile/Payments/Show', compact('payments', 'user'));
    }

    public function createPayment(Payment_method $payment)
    {
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        return Inertia::render('Profile/Payments/Create', compact('payment', 'user'));
    }

    public function storePayment(Request $request)
    {
        
        // Validate the incoming request data
        $validatedData = $request->validate([
            'owner_name' => 'required|string',
            'number' => 'required|string',
            'cvv' => 'required|string',
            'default' => 'integer'
        ]);

        if ($validatedData) {
            $request->input('expire_month') &&  $request->input('expire_year') ? $validatedData['expire_date'] = $request->input('expire_month') . "/" . $request->input('expire_year') : '';
            $validatedData['user_id'] = auth()->user()->id;

            if ($request->input('default') && $request->input('default') == 1) {
                // Set all payment methods as not defaul
                $payments = Payment_method::where('user_id', auth()->user()->id)->get();
                foreach ($payments as $payment) {
                    $payment->update(['default' => false]);
                }
            }
            
            try {
                Payment_method::create($validatedData);
        
                return redirect()->route('profile.payments');
            } catch (Exception $e) {
                \Log::error($e->getMessage());

                return response()->json(['error' => 'Internal Server Error'], 500);
            }
        } else {
            return response()->json(['error' => 'Cannot add this payment method'], 500);
        }
        
    }

    public function editPayment(Payment_method $payment)
    {
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        return Inertia::render('Profile/Payments/Edit', compact('payment', 'user'));
    }

    public function updatePayment(Request $request, Payment_method $payment) {
        try {
            // Custom validation for "mm/yyyy" format
            $validatedData = [
                'owner_name' => $request->input('owner_name'),
                'default' => $request->input('default'),
            ];

            $validatedData["expire_date"] = $request->input('expire_month') . "/" . substr($request->input('expire_year'), -2);

            if ($validatedData['default'] == 1) {
                // Set all payment methods as not defaul
                $payments = Payment_method::where('user_id', auth()->user()->id)->get();
                foreach ($payments as $payment) {
                    $payment->update(['default' => false]);
                }
            }

            // Find the payment method by ID
            $paymentMethod = Payment_method::find($payment->id);
    
            // Update the payment method with los datos forzados
            $paymentMethod->update($validatedData);
        } catch (\Exception $e) {
            //return response()->json(['error' => 'Cannot save this payment method'], 500);
        }
    }

    public function deletePayment(Request $request, Payment_method $payment) {
        try {
            $payment->delete();

            return $this->payments();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cannot delete this payment method'], 500);
        }
    }

    public function preview(Request $request)
{
    $user = auth()->user();
    $file = $request->file('file');

    // Get all colors
    $colors = Color::all();
    // Get all materials
    $materials = Material::all();

    if ($file) {
        $filePath = $file->store('stl', 'public');
        $fileUrl = asset('storage/' . $filePath);
        $localFilePath = storage_path('app/public/' . $filePath);

        try {            
            $dimensions = $this->getModelDimensions($localFilePath);
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Error uploading file.');
        }

        return Inertia::render('Preview', compact('user', 'fileUrl', 'colors', 'materials', 'dimensions'));
    } else {
        return redirect()->back()->with('error', 'Error uploading file.');
    }
}

private function getModelDimensions($filePath)
{
    $reader = STLReader::forFile($filePath);
    $reader->setHandler(new VolumeHandler());
    $volume = $reader->readModel();

    // Check if the volume is infinite or non-numeric
    if (!is_numeric($volume) || is_infinite($volume) || is_nan($volume)) {
        // Handle the invalid value, for example, assign a default value
        $volume = 0;
    }

    $length = pow($volume, 1 / 3); 
    $width = $length; 
    $height = $length;

    // Check if the calculated dimensions are infinite or non-numeric
    if (!is_numeric($length) || is_infinite($length) || is_nan($length)) {
        // Handle the invalid value, for example, assign a default value
        $length = 0;
    }

    if (!is_numeric($width) || is_infinite($width) || is_nan($width)) {
        // Handle the invalid value, for example, assign a default value
        $width = 0;
    }

    if (!is_numeric($height) || is_infinite($height) || is_nan($height)) {
        // Handle the invalid value, for example, assign a default value
        $height = 0;
    }

    return [
        'length' => $length,
        'width' => $width,
        'height' => $height,
    ];
}

    public function generateModelNumber() {
        $length = 8;

        $modelNumber = mt_rand(pow(10, $length - 1), pow(10, $length) - 1);

        return $modelNumber;
    }

    public function addModelToCart(Request $request) {
        $fileUrl = $request->input('file_url');
        $color = $request->input('color');
        $material = $request->input('material');
        $price = $request->input('price');
        $quantity = $request->input('quantity');
        $width = $request->input('width');
        $height = $request->input('height');
        $length = $request->input('length');

        $user = auth()->user();
        $modelNumber = $this->generateModelNumber();

        // Get color id
        $colorId = Color::where('name', $color)->first()->id;

        // Get material id
        $materialId = Material::where('name', $material)->first()->id;

        // Create product
        $product = Product::create([
            'name' => $user->name . ' ' . $user->lastname . ' - Model ' . $modelNumber,
            'description' => $user->name . ' ' . $user->lastname . ' created model No. ' . $modelNumber,
            'price' => $price,
            'user_id' => $user->id,
            'image' => null,
            'visible' => false,
            'file' => $fileUrl,
            'width' => $width,
            'height' => $height,
            'length' => $length
        ]);

        // Create prod_comb
        $prodComb = Prod_comb::create([
            'product_id' => $product->id,
            'color_id' => $colorId,
            'material_id' => $materialId,
        ]);

        // Add to cart
        $cart = Cart::where('user_id', $user->id)->where('active', '=', 1)->firstOrFail();
        
        // Check if the Stock_cart already exists for the current combination
        $existingStockCart = Stock_cart::where('cart_id', $cart->id)
        ->where('prod_comb_id', $prodComb->id)
        ->first();

        if ($existingStockCart) {
            // If it exists, update the quantity
            $existingStockCart->increment('quantity');
        } else {
            // If it doesn't exist, create a new Stock_cart with quantity 1
            Stock_cart::create([
                'cart_id' => $cart->id,
                'prod_comb_id' => $prodComb->id,
                'quantity' => $quantity
            ]);
        }

        return redirect()->route('user.cart');
    }
}
