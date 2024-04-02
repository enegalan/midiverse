<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    private $productPerPagination = 15;
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response {
        $this->getRoles();
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function avatar(Request $request): RedirectResponse {
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

    public function deleteAvatar(Request $request) {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
            $user->avatar = null;
            $user->save();
        }

        return back()->with('status', 'Avatar deleted successfully.');
    }

    /**
     * Store user.
     */
    public function store(Request $request) {
        if ($request->has('google_user')) {
            $userRequest = json_decode($request->input('google_user'), true);
            if (array_key_exists('sub', $userRequest)) {
                $email = $userRequest['email'];
                $sub = $userRequest['sub'];

                // Check if user already exists
                $existingUser = User::where('email', $email)->orWhere('sub', $sub)->first();

                if ($existingUser) {
                    // User already exists, return error response
                    return response()->json(['status' => 'User already exists'], 409);
                }

                // User does not exist, proceed with creating the user
                $name = $userRequest['given_name'];
                $lastname = $userRequest['family_name'];
                $avatar = $userRequest['picture'];
                $username = explode('@', $email)[0];

                $userAtts = [
                    'email' => $email,
                    'name' => $name,
                    'lastname' => $lastname,
                    'username' => $username,
                    'avatar' => $avatar,
                    'sub' => $sub,
                    'email_verified_at' => now(),
                ];
            }
        } else if ($request->has('user')) {
            $userRequest = json_decode($request->input('user'), true);
            $user = $userRequest[0];
            $name = $user['name'];
            $birthdate = $user['birthdate'];
            $password = password_hash($user['password'], PASSWORD_DEFAULT);
            $email = $user['email'];
            $username = explode('@', $email)[0];
            $userAtts = [
                'email' => $email,
                'name' => $name,
                'password' => $password,
                'birthdate' => $birthdate,
                'username' => $username,
            ];
        }

        // Create user
        $user = User::create($userAtts);

        // Assign guest role
        $role = Role::where('name', 'guest')->first();
        $user->roles()->attach($role);

        // Start session
        session_start();
        $_SESSION['user'] = $user;

        // Fire Registered event
        event(new Registered($user));

        // Login user
        Auth::login($user);

        return response()->json(['message' => 'User created successfully'], 201);
    }

    /**
     * Login user.
     */
    public function login(Request $request) {
        if ($request->has('google_user')) {
            $googleUser = json_decode($request->input('google_user'), true);
            $user = User::where('email', $googleUser['email'])->where('sub', $googleUser['sub'])->first();

            if ($user) {
                $this->startSessionAndLogin($user);
                return response()->json(['message' => 'Google authentication successful'], 200);
            }
        } elseif ($request->has('user')) {
            $user = json_decode($request->input('user'), true)[0];
            $userFromDB = User::where('email', $user['email'])->first();

            if ($userFromDB && password_verify($user['password'], $userFromDB->password)) {
                $this->startSessionAndLogin($userFromDB);
                return response()->json(['message' => 'Authentication successful'], 200);
            }
        }

        return response()->json(['message' => 'Authentication failed'], 401);
    }

    private function startSessionAndLogin($user) {
        session_start();
        $_SESSION['user'] = $user;
        Auth::login($user);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse {
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
    public function destroy(Request $request): RedirectResponse {
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

    public static function getProfileData ($user) {
        if ($user['name'] === auth()->user()->name) {
            $user = auth()->user();
        }
        app()->call([self::class, 'getRoles'], compact('user'));
        app()->call([self::class, 'getPosts'], compact('user'));
        app()->call([self::class, 'getFollowers'], compact('user'));
        app()->call([self::class, 'getFollowings'], compact('user'));
        app()->call([self::class, 'getUserPostsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserPostsReceivedLikes'], compact('user'));
        app()->call([self::class, 'getUserConcertsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserConcertsReceivedLikes'], compact('user'));
        app()->call([self::class, 'getUserMidis'], compact('user'));
    }

    public static function getRoles($user) {
        if (auth()->check()) {
            $roles = auth()->user()->roles->pluck('name')->toArray();
            return $roles;
        }
        return array('You are not logged in.');
    }

    public static function getPosts() {
        if (auth()->check()) {
            $posts = auth()->user()->posts->pluck('name')->toArray();
            return $posts;
        }
        return array('You are not logged in.');
    }

    public static function getFollowings() {
        if (auth()->check()) {
            $followings = auth()->user()->followings->pluck('name')->toArray();
            return $followings;
        }
        return array('You are not logged in.');
    }

    public static function getFollowers() {
        if (auth()->check()) {
            $followers = auth()->user()->followers->pluck('name')->toArray();
            return $followers;
        }
        return array('You are not logged in.');
    }

    public static function getUserPostsGivenLikes() {
        if (auth()->check()) {
            $user = auth()->user();
            $postIds = $user->posts->pluck('id')->toArray();
            $postLikesGiven = DB::table('post_likes')
                                ->whereIn('post_id', $postIds)
                                ->pluck('user_id')
                                ->toArray();

            $user->post_given_likes = $postLikesGiven;

            return $postLikesGiven;
        }
        return array('You are not logged in.');
    }

    public static function getUserPostsReceivedLikes() {
        if (auth()->check()) {
            $user = auth()->user();
            $postLikesReceived = $user->posts->flatMap(function ($post) {
                return DB::table('post_likes')
                            ->where('post_id', $post->id)
                            ->pluck('user_id')
                            ->toArray();
            });

            $user->post_received_likes = $postLikesReceived;

            return $postLikesReceived;
        }
        return array('You are not logged in.');
    }

    public static function getUserConcertsGivenLikes() {
        if (auth()->check()) {
            $user = auth()->user();
            $concertIds = DB::table('concerts')
                            ->where('user_id', $user->id)
                            ->pluck('id')
                            ->toArray();
            $concertLikesGiven = DB::table('concert_likes')
                                        ->whereIn('concert_id', $concertIds)
                                        ->pluck('user_id')
                                        ->toArray();

            $user->concert_given_likes = $concertLikesGiven;

            return $concertLikesGiven;
        }
        return array('You are not logged in.');
    }

    public static function getUserConcertsReceivedLikes() {
        if (auth()->check()) {
            $user = auth()->user();
            $concertLikesReceived = DB::table('concert_likes')
                                        ->where('user_id', $user->id)
                                        ->pluck('concert_id')
                                        ->toArray();

            $user->concert_received_likes = $concertLikesReceived;

            return $concertLikesReceived;
        }
        return array('You are not logged in.');
    }

    public static function getUserMidis () {
        if (auth()->check()) {
            $user = auth()->user();
            $midis = $user->midis->pluck('midi')->toArray();
            $user->midis = $midis;
            return $midis;
        }
        return array('You are not logged in.');
    }

    public function restore($id) {
        $user = User::withTrashed()->find($id);

        if ($user) {
            $user->restore();
        } else {
            abort('402', 'User not found');
        }
    }
    public function dashboard() {
        $user = User::findOrFail(auth()->user()->id);
        $user->roles;
        return Inertia::render('', compact('user', 'orders', 'wishlist'));
    }

    public function existsByEmail(Request $request) {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if ($user) {
            return response()->json(['status' => 'true']);
        }

        return response()->json(['status' => 'false']);

    }

}
