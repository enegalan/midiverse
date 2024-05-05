<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Group;
use App\Models\Role;
use App\Models\User;
use App\Models\UserMidi;
use App\Models\Post;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private $productPerPagination = 15;

    public static function loadUserData(&$user)
    {
        app()->call([self::class, 'getRoles'], compact('user'));
        app()->call([self::class, 'getPosts'], compact('user'));
        app()->call([self::class, 'getFollowers'], compact('user'));
        app()->call([self::class, 'getFollowings'], compact('user'));
        app()->call([self::class, 'getUserPostsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserPostsReceivedLikes'], compact('user'));
        app()->call([self::class, 'getUserConcertsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserConcertsReceivedLikes'], compact('user'));
        app()->call([self::class, 'getUserMidis'], compact('user'));
        app()->call([self::class, 'getConcerts'], compact('user'));
        app()->call([self::class, 'getGroups'], compact('user'));
        app()->call([self::class, 'getAuthType'], compact('user'));
    }
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = auth()->user();
        $this->getRoles($user);
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
     * Store user.
     */
    public function store(Request $request)
    {
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
    public function login(Request $request)
    {
        if ($request->has('google_user')) {
            $googleUser = json_decode($request->input('google_user'), true);
            $user = User::where('email', $googleUser['email'])->where('sub', $googleUser['sub'])->first();
            if ($user) {
                $this->startSessionAndLogin($user);
                $request->session()->regenerate();
                return redirect()->intended(RouteServiceProvider::HOME);
            }
        } elseif ($request->has('user')) {
            $user = json_decode($request->input('user'), true)[0];
            $userFromDB = User::where('email', $user['email'])->first();
            if ($userFromDB && password_verify($user['password'], $userFromDB->password)) {
                $this->startSessionAndLogin($userFromDB);
                $request->session()->regenerate();
                return redirect()->intended(RouteServiceProvider::HOME);
            }
        }
        return response()->json(['message' => 'Authentication failed'], 401);
    }

    private function startSessionAndLogin($user)
    {
        session_start();
        $_SESSION['user'] = $user;
        Auth::login($user);
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

    public function getProfile($username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return redirect()->route('home');
        }
        $auth_user = auth()->user();
        $this->getProfileData($user);
        $this->getProfileData($auth_user);
        return Inertia::render('Profile', ['auth_user' => $auth_user, 'user' => $user]);
    }

    public function getProfileData(&$user)
    {
        if ($user['username'] === auth()->user()->username) {
            $user = auth()->user();
        }
        $this->loadUserData($user);
    }

    public static function getRoles(&$user)
    {
        if (auth()->check()) {
            $roles = $user->roles->pluck('name')->toArray();
            return $roles;
        }
        return array('You are not logged in.');
    }

    public static function getPosts(&$user)
    {
        if (auth()->check()) {
            $posts = $user->posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'user' => [
                        'avatar' => $post->user->avatar,
                        'name' => $post->user->name,
                        'lastname' => $post->user->lastname,
                        'username' => $post->user->username,
                    ],
                    'content' => $post->content,
                    'date' => $post->created_at->toDateString(),
                    'comments' => $post->comments->count(),
                    'likes' => $post->likes->count(),
                ];
            });

            return $posts;
        }
        return array('You are not logged in.');
    }

    public static function getFollowings(&$user)
    {
        if (auth()->check()) {
            $followings = $user->followings->pluck('name')->toArray();
            return $followings;
        }
        return array('You are not logged in.');
    }

    public static function getFollowers(&$user)
    {
        if (auth()->check()) {
            $followers = $user->followers->pluck('name')->toArray();
            return $followers;
        }
        return array('You are not logged in.');
    }

    public static function getConcerts(&$user)
    {
        if (auth()->check()) {
            $concerts = $user->concerts->pluck('name')->toArray();
            return $concerts;
        }
        return array('You are not logged in.');
    }

    public static function getUserPostsGivenLikes(&$user)
    {
        if (auth()->check()) {
            $postIds = Post::all()->pluck('id')->toArray();
            $postLikesGiven = DB::table('post_likes')
                ->whereIn('post_id', $postIds)->where('user_id', $user->id)->get()->toArray();
            $user->post_given_likes = $postLikesGiven;
            return $postLikesGiven;
        }
        return array('You are not logged in.');
    }

    public static function getUserPostsReceivedLikes(&$user)
    {
        if (auth()->check()) {
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

    public static function getUserConcertsGivenLikes(&$user)
    {
        if (auth()->check()) {
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

    public static function getUserConcertsReceivedLikes(&$user)
    {
        if (auth()->check()) {
            $concertLikesReceived = DB::table('concert_likes')
                ->where('user_id', $user->id)
                ->pluck('concert_id')
                ->toArray();

            $user->concert_received_likes = $concertLikesReceived;

            return $concertLikesReceived;
        }
        return array('You are not logged in.');
    }

    public static function getUserMidis(&$user)
    {
        if (auth()->check()) {
            if ($user->midis) {
                $midis = $user->midis->pluck('midi')->toArray();
                $user->midis = $midis;
                return $midis;
            }
        }
        return array('You are not logged in.');
    }

    public static function getGroups(&$user)
    {
        if (auth()->check()) {
            $groups = $user->groups->pluck('name')->toArray();
            return $groups;
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

    public function existsByEmail(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if ($user) {
            return response()->json(['status' => 'true']);
        }
        return response()->json(['status' => 'false']);
    }

    public function toggleFollow($username)
    {
        $user = User::where('username', $username)->first();
        if (auth()->check() && $username !== auth()->user()->username) {
            $authUser = auth()->user();
            $isFollowing = $authUser->followings->contains($user);
            if ($isFollowing) {
                $authUser->followings()->detach($user->id);
                $status = false;
            } else {
                $authUser->followings()->attach($user->id);
                $status = true;
            }
            return response()->json(['status' => $status]);
        } else {
            return response()->json(['status' => 'false']);
        }
    }

    public function isFollowing($username)
    {
        if (auth()->check() && $username != auth()->user()->username) {
            $user = User::where('username', $username)->first();
            $authUserId = auth()->id();

            // Verificar si el usuario autenticado sigue al usuario objetivo
            $isFollowing = DB::table('user_followers')
                ->where('user_id', $user->id)
                ->where('follower_id', $authUserId)
                ->exists();

            // Devolver una respuesta JSON indicando si el usuario está siguiendo al usuario objetivo
            return response()->json(['status' => $isFollowing]);
        } else {
            return response()->json(['status' => 'false']);
        }
    }

    public static function getTopUsers()
    {
        $limit = 10;
        $topUsers = DB::table('user_followers')
            ->select('user_id', DB::raw('COUNT(*) as follower_count'))
            ->groupBy('user_id')
            ->orderBy('follower_count', 'desc')
            ->limit($limit)->get();

        $users = User::whereIn('id', $topUsers->pluck('user_id'))->get();
        return $users;
    }

    public static function getAllUsers()
    {
        $users = User::all();
        return $users;
    }

    public function renderUserFollowings($username)
    {
        if ($username === auth()->user()->username) {
            $user = auth()->user();
        } else {
            $user = User::where('username', $username)->firstOrFail();
        }
        $auth_user = auth()->user();
        $type = 'following';
        $followers = $this->getUserFollowers($user);
        $followings = $this->getUserFollowings($user);
        $this->loadUserData($user);
        $this->loadUserData($auth_user);
        return Inertia::render('Follows', compact('auth_user', 'user', 'type', 'followers', 'followings'));
    }

    public function renderUserFollowers($username)
    {
        if ($username === auth()->user()->username) {
            $user = auth()->user();
        } else {
            $user = User::where('username', $username)->first();
        }
        $auth_user = auth()->user();
        $type = 'followers';
        $followers = $this->getUserFollowers($user);
        $followings = $this->getUserFollowings($user);
        $this->loadUserData($user);
        $this->loadUserData($auth_user);
        return Inertia::render('Follows', compact('auth_user', 'user', 'type', 'followers', 'followings'));
    }

    public static function getUserFollowings($user)
    {
        $followingsIds = DB::table('user_followers')->where('follower_id', $user->id)->get();
        $followings = User::whereIn('id', $followingsIds->pluck('user_id'))->get();
        return $followings;
    }

    private function getUserFollowers($user)
    {
        $followersIds = DB::table('user_followers')->where('user_id', $user->id)->get();
        $followers = User::whereIn('id', $followersIds->pluck('follower_id'))->get();
        return $followers;
    }

    // TODO: Must define a way to store Midi from Piano-code and send it as an url .midi file so it can be stored in DB.
    public static function storeMidi(Request $request)
    {
        $midi = json_decode($request->input('midi'), true);
        UserMidi::create([
            'user_id' => auth()->user()->id,
            'midi' => $midi['midi'],
            'name' => $midi['name'],
            'description' => $midi['description'],
            'duration' => $midi['duration'],
        ]);
    }

    public function renderGroups()
    {
        $auth_user = auth()->user();
        $groups = Group::all();
        $this->loadUserData($auth_user);
        $top_groups = app()->call([GroupController::class, 'getTopGroups']);
        return Inertia::render('Groups', compact('auth_user', 'groups', 'top_groups'));
    }

    public static function getFollowsPosts(&$follows_posts)
    {
        $users_follows = app()->call([self::class, 'getUserFollowings'], ['user' => auth()->user()]);
        $follows_posts = [];
        foreach ($users_follows as $user_follow) {
            $user_posts = Post::where('user_id', $user_follow['id'])->orderBy('created_at', 'desc')->get();
            $user_posts->load('user');
            foreach ($user_posts as $post) {
                $follow_post = [
                    'id' => $post->id,
                    'user' => [
                        'avatar' => $post->user->avatar,
                        'name' => $post->user->name,
                        'lastname' => $post->user->lastname,
                        'username' => $post->user->username,
                    ],
                    'content' => $post->content,
                    'date' => $post->created_at->toDateString(),
                    'comments' => $post->comments,
                    'comments_count' => $post->comments->count(),
                    'likes' => $post->likes,
                    'likes_count' => $post->likes->count(),
                    
                ];
                array_push($follows_posts, $follow_post);
            }
        }
        return $follows_posts;
    }

    public static function verifyPassword(Request $request) : bool {
        $password = $request->input('password');
        if ($password) {
            $user = Auth::user();
            if (password_verify($password, $user['password'])) {
                return true;
            }
            return false;
        }
        return false;
    }

    public static function getAuthType(&$user){
        $type = 'manual';
        $user->auth_type = $type;
        $user2 = User::find($user['id']);
        if ($user2 && $user2['password'] == null) {
            $type = 'google';
            $user->auth_type = $type;
        }
    }

    public static function updateAuthUserProfile(Request $request) {
        $auth_user = auth()->user();
        $user = User::findOrFail($auth_user->id);
        $name = $request->input('name');
        $lastname = $request->input('lastname');
        $description = $request->input('description');
        $birthdate = $request->input('birthdate');
        if ($name) {
            $data = array();
            if ($name) {
                $data['name'] = $name;
            }
            $data['lastname'] = null;
            if ($lastname) {
                $data['lastname'] = $lastname;
            }
            $data['description'] = null;
            if ($description) {
                $data['description'] = $description;
            }
            $data['birthdate'] = null;
            if ($birthdate) {
                $data['birthdate'] = $birthdate;
            }
            $user->updateOrFail($data);
            return response()->json(array('status' => 'Profile successfully updated'));
        } else {
            return response()->json(array('status' => 'Name is required'));
        }
    }

}
