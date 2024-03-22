<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Color;
use App\Models\Country;
use App\Models\Material;
use App\Models\Order;
use App\Models\Prod_comb;
use App\Models\Product;
use App\Models\Region;
use App\Models\Role;
use App\Models\Ship_address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }
    public function dashboard()
    {
        app()->call([UserController::class, 'getRoles']);
        // Get reports
        $ordersYear = $this->getOrdersThisYear();
        $usersMonth = $this->getUsersThisMonth();
        $ordersZone = $this->getOrdersByZoneThisYear();
        return (
            Inertia::render('Admin/Reports', compact('ordersYear', 'usersMonth', 'ordersZone'))
        );
    }

    public function getOrdersThisYear()
    {
        $currentYear = date('Y');
        $months = range(1, 12);

        $ordersData = Order::select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $result = [];
        foreach ($months as $month) {
            $result[$month] = $ordersData[$month] ?? 0;
        }

        return $result;
    }

    public function getUsersThisMonth()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');
        $lastDayOfMonth = date('t', mktime(0, 0, 0, $currentMonth, 1, $currentYear));
        $days = range(1, $lastDayOfMonth);

        // Obtener todos los días del mes con la cantidad de usuarios registrados
        $usersData = User::select(DB::raw('DAY(created_at) as day'), DB::raw('COUNT(*) as count'))
            ->whereMonth('created_at', $currentMonth)
            ->groupBy('day')
            ->pluck('count', 'day')
            ->toArray();

        // Llenar el array asociativo con todos los días del mes
        $result = [];
        foreach ($days as $day) {
            $result[$day] = $usersData[$day] ?? 0;
        }

        return $result;
    }

    public function getOrdersByZoneThisYear()
    {
        // Get all orders this year
        $currentYear = date('Y');
        $orders = Order::whereYear('created_at', $currentYear)->get();

        // Get all ship_addresse_id of orders
        $ordersByZone = [];

        foreach ($orders as $order) {
            // Obtener la dirección de envío asociada al pedido
            $shipAddressId = $order->ship_addresse_id;
            $address = Ship_address::find($shipAddressId);
            if ($address) {
                // Obtener el ID del país desde la dirección
                $countryId = $address->country_id;

                // Obtener el nombre del país
                $countryName = DB::table('countries')->where('id', $countryId)->value('name');

                // Incrementar el contador de pedidos para ese país
                if (!isset($ordersByZone[$countryName])) {
                    $ordersByZone[$countryName] = 1;
                } else {
                    $ordersByZone[$countryName]++;
                }
            }
        }

        return ['ordersLabels' => array_keys($ordersByZone), 'ordersValues' => array_values($ordersByZone)];
    }

    public function countries()
    {
        app()->call([UserController::class, 'getRoles']);
        $countries = Country::paginate($this->productPerPagination);
        return (
            Inertia::render('Admin/Country/Countries', ['countries' => $countries])
        );
    }

    public function viewCountryRegions(Country $country)
    {
        $regions = Region::where('country_id', $country->id)->paginate($this->productPerPagination);
        return Inertia::render('Admin/Country/View', compact('regions'));
    }

    public function deletecountry(Country $country)
    {
        try {
            $country->delete();

        } catch (\Exception $e) {
            throw $e;
        }
    }

    private $productPerPagination = 15;

    public function regions()
    {
        app()->call([UserController::class, 'getRoles']);
        $regions = Region::paginate($this->productPerPagination);
        $regions->load('country');

        return (
            Inertia::render('Admin/Region/Regions', ['regions' => $regions])
        );
    }

    public function deleteregion(Region $region)
    {
        try {

            $region->delete();

        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function products()
    {
        app()->call([UserController::class, 'getRoles']);
        $products = Product::query()
        ->when(request('search'), function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
        ->paginate(10)
        ->withQueryString();

        $products->load('user','categories');

        $filters = request()->only(['search']);
        return (
            Inertia::render('Admin/Product/Products', ['products' => $products, 'filters' => $filters])        );
    }

    public function addProduct()
    {
        app()->call([UserController::class, 'getRoles']);
        $categories = Category::all();
        $user = auth()->user();
        return Inertia::render('Admin/Product/Add', compact('user', 'categories'));
    }

    public function editProduct(Product $product)
    {
        $user = auth()->user();
        $user->roles();
        $roles = Role::all();
        $product->load('categories');
        $categories = Category::all();
        return Inertia::render('Admin/Product/Edit', compact('product', 'user', 'roles', 'categories'));
    }

    public function deleteProduct(Product $product)
    {
        try {

            $product->delete();

        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function users()
    {
        app()->call([UserController::class, 'getRoles']);

        $users = User::withTrashed()->paginate($this->productPerPagination);
        $users->load('roles');
        return (
            Inertia::render('Admin/User/Users', ['users' => $users])
        );
    }

    public function createUser()
    {
        $user = auth()->user();
        $roles = Role::all();
        return Inertia::render('Admin/User/Add', ['user' => $user, 'roles' => $roles]);
    }

    public function storeUser(Request $request)
    {
        $validatedData = request()->validate([
            'name' => 'string|required',
            'lastname' => 'string|required',
            'birthdate' => 'required',
            'email' => 'string|required',
            'password' => 'string|required',
            'roles' => 'array|required',
        ]);

        $validatedData['email_verified_at'] = now();
        $validatedData['user_id'] = auth()->user()['id'];

        $user = User::create($validatedData);

        $user->roles()->sync($validatedData['roles']);

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');

            $avatarName = $avatar->hashName();
            $avatar->storeAs('avatars', $avatarName, 'public');

            // Delete the previous avatar if it exists
            if ($user->avatar) {
                Storage::disk('public')->delete('avatars/' . $user->avatar);
            }

            $user->avatar = $avatarName;
            $user->save();
        }

        return redirect()->route('admin.users');
    }

    public function editUser(string $id)
    {
        $roles = Role::all();
        $user = User::withTrashed()->find($id)->load('roles');
        return Inertia::render('Admin/User/Edit', ['user' => $user, 'roles' => $roles]);
    }

    public function updateUser(Request $request, $id, $withTrashed = false)
    {
        $user = $withTrashed ? User::withTrashed()->findOrFail($id) : User::findOrFail($id);
        $validatedData = $request->validate([
            'name' => 'string|required',
            'lastname' => 'string|required',
            'birthdate' => 'required',
            'email' => 'string|required',
            'roles' => 'array',
        ]);

        // Prepare the update array with fields that should always be updated
        $updateData = [
            'name' => $validatedData['name'],
            'lastname' => $validatedData['lastname'],
            'birthdate' => $validatedData['birthdate'],
            'email' => $validatedData['email'],
        ];

        // Check if password is provided in the request, and include it in the update array
        if ($request->has('password')) {
            $updateData['password'] = bcrypt($request->input('password')); // Hash the password
        }

        // Update user attributes
        $user->update($updateData);

        if ($request->input('roles')) {
            $roles = $request->input('roles');

            $user->roles()->detach();
            if (count($roles) > 0) {
                $roleIds = array_map(function ($role) {
                    return $role['id'];
                }, $roles);
                $user->roles()->attach($roleIds);
            }
        } else {
            $user->roles()->detach();
        }

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');

            $avatarName = $avatar->hashName();
            $avatar->storeAs('avatars', $avatarName, 'public');

            // Delete the previous avatar if it exists
            if ($user->avatar) {
                Storage::disk('public')->delete('avatars/' . $user->avatar);
            }

            // Update user avatar
            $user->update(['avatar' => $avatarName]);
            return "Avatar updated";
        }

        return redirect()->route('admin.users');
    }

    public function toggleStatus(string $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        try {

            if ($user->trashed()) {

                $user->restore();
            } else {

                $user->delete();
            }

        } catch (\Exception $e) {

        }
    }

    public function orders()
    {
        app()->call([UserController::class, 'getRoles']);
        $orders = Order::paginate($this->productPerPagination);
        $orders->load('invoice');
        return (
            Inertia::render('Admin/Order/Orders', ['orders' => $orders])
        );
    }

    public function viewOrder(Order $order)
{
    $order->load(['cart.stock_carts.prod_comb.product.user', 'invoice']);
        //$user = auth()->user();
        //$user->roles();
        //$userId = $user->id;

        // Extracting products from the order
        $products = [];
        // Obtener el primer cart que tenga active == 1
        $cart = $order->cart;

        if ($cart) {
            // Obtener el prod_comb_id desde stock_carts
            $stockCart = $cart->stock_carts->first();
        
            if ($stockCart) {
                $prodCombId = $stockCart->prod_comb_id;

                // Obtener el product_id, color_id y material_id desde prod_combs
                $prodComb = Prod_comb::findOrFail($prodCombId);

                $color = Color::find($prodComb->color_id);
                $colorName = $color->name;
                $colorHex = $color->hex;


                if ($prodComb) {
                    $productId = $prodComb->product_id;

                    // Obtener el name, image, file y price desde products
                    $product = Product::findOrFail($productId);

                    if ($product) {
                        // Agregar la información del producto al array de productos
                        $products[] = [
                            'id' => $product->id,
                            'name' => $product->name,
                            'image' => $product->image,
                            'file' => $product->file,
                            'price' => $product->price,
                            'colorName' => $colorName,
                            'colorHex' => $colorHex,
                        ];
                    }
                }
            }
        }

    return Inertia::render('Admin/Order/ViewOrder', [
        'order' => $order,
        'products' => $products,
    ]);
}

    public function materials()
    {
        app()->call([UserController::class, 'getRoles']);
        $materials = Material::paginate($this->productPerPagination);
        return (
            Inertia::render('Admin/Material/Materials', ['materials' => $materials])
        );
    }

    public function addMaterial()
    {
        return Inertia::render('Admin/Material/Add');
    }

    public function storeMaterial(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1',
        ]);
        Material::create($validatedData);

        return redirect()->route('admin.materials');
    }

    public function editMaterial(Material $material)
    {
        return Inertia::render('Admin/Material/Edit', compact('material'));
    }

    public function updateMaterial(Request $request, Material $material)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1',
        ]);
        $material->update($validatedData);

        return redirect()->route('admin.materials');
    }

    public function deletematerial(Material $material)
    {
        try {

            $material->delete();

        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function colors()
    {
        app()->call([UserController::class, 'getRoles']);
        $colors = Color::paginate($this->productPerPagination);
        return (
            Inertia::render('Admin/Color/Colors', ['colors' => $colors])
        );
    }

    public function addColor()
    {
        return Inertia::render('Admin/Color/Add');
    }

    public function editColor(Color $color)
    {
        return Inertia::render('Admin/Color/Edit', compact('color'));
    }

    public function storeColor(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1',
            'hex' => 'required',
            'factor' => 'required',
        ]);
        Color::create($validatedData);

        return redirect()->route('admin.colors');
    }

    public function updateColor(Request $request, Color $color)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1',
            'hex' => 'required',
            'factor' => 'required',
        ]);
        $color->update($validatedData);

        return redirect()->route('admin.colors');
    }

    public function deletecolor(Color $color)
    {
        try {

            $color->delete();

        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function categories()
    {
        app()->call([UserController::class, 'getRoles']);
        $categories = Category::paginate($this->productPerPagination);
        return (
            Inertia::render('Admin/Category/Categories', ['categories' => $categories])
        );
    }

    public function addCategory()
    {
        return Inertia::render('Admin/Category/Add');
    }

    public function storeCategory(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1',
        ]);
        Category::create($validatedData);

        return redirect()->route('admin.categories');
    }

    public function editCategory(Category $category)
    {
        return Inertia::render('Admin/Category/Edit', compact('category'));
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1',
        ]);

        $category->update($validatedData);

        return redirect()->route('admin.categories');
    }

    public function deletecategory(Category $category)
    {
        try {

            $category->delete();

        } catch (\Exception $e) {
            throw $e;
        }
    }

}
