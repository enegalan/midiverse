<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Profile;
use App\Models\Role;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|regex:/^[^0-9]+$/',
            'lastname' =>'required|string|max:255|regex:/^[^0-9]+$/',
            'birthdate' => 'required|date',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'lastname'=> $request->lastname,
            'birthdate'=>$request->birthdate,
            'avatar' => null,
        ]);

        $role = Role::where('name', 'guest')->first(); // Reemplaza 'tu_rol' con el nombre del rol que desees asignar
        $user->roles()->attach($role);

        $cart = Cart::create([
            'user_id' => $user->id,
            'active' => 1
        ]);

        $cart->save();

        event(new Registered($user));

        Auth::login($user);

        return Redirect::route('verification.notice');    }
}
