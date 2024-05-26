<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Comment;
use App\Models\Group;
use App\Models\GroupNotification;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use App\Models\UserMidi;
use App\Models\UserNotification;
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
    public static function loadUserData(&$user)
    {
        app()->call([self::class, 'getRoles'], compact('user'));
        app()->call([self::class, 'getPosts'], compact('user'));
        app()->call([self::class, 'getFollowers'], compact('user'));
        app()->call([self::class, 'getFollowings'], compact('user'));
        app()->call([self::class, 'getUserPostsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserComments'], compact('user'));
        app()->call([self::class, 'getUserCommentsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserPostsReceivedLikes'], compact('user'));
        app()->call([self::class, 'getUserConcertsGivenLikes'], compact('user'));
        app()->call([self::class, 'getUserConcertsReceivedLikes'], compact('user'));
        app()->call([self::class, 'getUserBookmarks'], compact('user'));
        app()->call([self::class, 'getUserMidis'], compact('user'));
        app()->call([self::class, 'getConcerts'], compact('user'));
        app()->call([self::class, 'getGroups'], compact('user'));
        app()->call([self::class, 'getAuthType'], compact('user'));
        app()->call([NotificationController::class, 'getUnreadNotificationsCount'], compact('user'));
        app()->call([NotificationController::class, 'getNotifications'], compact('user'));
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
        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::to('/');
    }

    public static function getProfile($username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return redirect()->route('home');
        }
        $auth_user = auth()->user();
        self::getProfileData($user);
        self::getProfileData($auth_user);
        $roles = RoleController::getRoles();
        return Inertia::render('Profile', ['auth_user' => $auth_user, 'user' => $user, 'roles' => $roles]);
    }

    public static function getProfileData(&$user)
    {
        if ($user['username'] === auth()->user()->username) {
            $user = auth()->user();
        }
        self::loadUserData($user);
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
                return self::getPostData($post);
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

    public static function getUserComments(&$user) {
        if (auth()->check()) {
            $commentsObj = Comment::where('user_id', $user->id)->get();
            $comments = array();
            foreach ($commentsObj as $comment) {
                $media = \DB::table('comment_media')->where('comment_id', $comment->id)->get();
                $comments[] = [
                    'id' => $comment->id,
                    'post_id' => $comment->post_id,
                    'user_id' => $comment->user_id,
                    'parent_id' => $comment->parent_id,
                    'token' => $comment->token,
                    'body' => $comment->body,
                    'comments_visibility' => $comment->comments_visibility,
                    'media' => $media,
                    'created_at' => $comment->created_at,
                    'updated_at' => $comment->updated_at,
                ];
            }
            $user->comments = $comments;
        }
        return array('You are not logged in.');
    }

    public static function getUserCommentsGivenLikes(&$user)
    {
        if (auth()->check()) {
            $commentIds = Comment::all()->pluck('id')->toArray();
            $commentsLikesGiven = DB::table('comment_likes')
                ->whereIn('comment_id', $commentIds)->where('user_id', $user->id)->get()->toArray();
            $user->comment_given_likes = $commentsLikesGiven;
            return $commentsLikesGiven;
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

    public static function getUserBookmarks(&$user)
    {
        if (auth()->check()) {
            $bookmarks = array();
            $user_post_bookmarks = \DB::table('user_post_bookmarks')->where('user_id', $user->id)->get();
            foreach ($user_post_bookmarks as $bookmark) {
                $post = Post::findOrFail($bookmark->post_id);
                $post = self::getPostData($post);
                $bookmarks[] = [
                    'id' => $bookmark->post_id,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'username' => $user->username,
                        'lastname' => $user->lastname,
                        'birthdate' => $user->id,
                        'avatar' => $user->avatar,
                        'banner' => $user->banner,
                        'description' => $user->description,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                        'private' => $user->private,
                    ],
                    'created_at' => $bookmark->created_at,
                    'updated_at' => $bookmark->updated_at,
                    'post' => $post,
                ];
            }
            $user->post_bookmarks = $bookmarks;
            $bookmarks = array();
            $user_comment_bookmarks = \DB::table('user_comment_bookmarks')->where('user_id', $user->id)->get();
            foreach ($user_comment_bookmarks as $bookmark) {
                $comment = Comment::findOrFail($bookmark->comment_id);
                $comment = self::getPostData($comment);
                $bookmarks[] = [
                    'id' => $bookmark->comment_id,
                    'user_id' => $bookmark->user_id,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'username' => $user->username,
                        'lastname' => $user->lastname,
                        'birthdate' => $user->id,
                        'avatar' => $user->avatar,
                        'banner' => $user->banner,
                        'description' => $user->description,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                        'private' => $user->private,
                    ],
                    'comment_id' => $bookmark->comment_id,
                    'created_at' => $bookmark->created_at,
                    'updated_at' => $bookmark->updated_at,
                    'comment' => $comment,
                ];
            }
            $user->comment_bookmarks = $bookmarks;
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
                if ($user && $user->private == 1) {
                    // Verify if user has already sent a follow request
                    $followAlreadySent = UserNotification::where('from_user_id', '=', $authUser->id)->where('user_id', '=', $user->id)->where('type', '=', UserNotification::NOTIFICATION_TYPE_FOLLOW)->exists();
                    if (!$followAlreadySent) {
                        // Send follow request
                        UserNotification::create([
                            'user_id' => $user->id,
                            'from_user_id' => $authUser->id,
                            'message' => NotificationController::getMessageForFollow($authUser->username),
                            'type' => UserNotification::NOTIFICATION_TYPE_FOLLOW,
                        ]);
                        return response()->json(['status' => true, 'sent' => true]);
                    } else {
                        UserNotification::where('from_user_id', '=', $authUser->id)->where('user_id', '=', $user->id)->where('type', '=', 0)->delete();
                    }
                } else {
                    $user?->followings()->sync($user->id);
                }
                $status = true;
            }
            return response()->json(['status' => $status]);
        } else {
            return response()->json(['status' => 'false']);
        }
    }

    public static function isFollowing($username)
    {
        if (auth()->check() && $username != auth()->user()->username) {
            $user = User::where('username', $username)->first();
            $authUserId = auth()->id();

            // Verificar si el usuario autenticado sigue al usuario objetivo
            $isFollowing = DB::table('user_followers')
                ->where('user_id', $user?->id)
                ->where('follower_id', $authUserId)
                ->exists();

            // Devolver una respuesta JSON indicando si el usuario está siguiendo al usuario objetivo
            return response()->json(['status' => $isFollowing])->getContent();
        } else {
            return response()->json(['status' => 'false'])->getContent();
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
                $follow_post = self::getPostData($post);
                array_push($follows_posts, $follow_post);
            }
        }
        return $follows_posts;
    }

    public static function getPostData($post) {
        $comments = \DB::table('comments')->where('post_id', $post->id)->get();
        $media = \DB::table('post_media')->where('post_id', $post->id)->get();
        return [
            'id' => $post->id,
            'user' => $post->user,
            'content' => $post->content,
            'created_at' => $post->created_at,
            'updated_at' => $post->updated_at,
            'comments' => $comments,
            'media' => $media,
            'comments_visibility' => $post->comments_visibility,
            'likes' => $post->likes,
            'token' => $post->token,
        ];
    }

    public static function verifyPassword(Request $request): bool {
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

    public static function getAuthType(&$user)
    {
        $type = 'manual';
        $user->auth_type = $type;
        $user2 = User::find($user['id']);
        if ($user2 && $user2['password'] == null) {
            $type = 'google';
            $user->auth_type = $type;
        }
    }

    public static function updateAuthUserProfile(Request $request)
    {
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

    public static function setSessionPrivate()
    {
        $user = User::findOrFail(auth()->user()->id);
        $user->private = !$user->private;
        $user->save();
    }

    public static function hasSentFollowRequest(Request $request)
    {
        $user_id = $request->input('user_id');
        if ($user_id) {
            $from_user_id = Auth::id();
            return UserNotification::where('user_id', '=', $user_id)->where('from_user_id', '=', $from_user_id)->where('type', '=', UserNotification::NOTIFICATION_TYPE_FOLLOW)->exists();
        }
        return false;
    }

    public static function acceptFollowRequest(Request $request)
    {
        $from_user_id = $request->input('user_id');
        if ($from_user_id) {
            $from_user = User::findOrFail($from_user_id);
            $user_id = Auth::id();
            $user = User::findOrFail($user_id);
            // Delete the from_user's follow request
            UserNotification::where('user_id', '=', $user_id)->where('from_user_id', '=', $from_user_id)->where('type', '=', UserNotification::NOTIFICATION_TYPE_FOLLOW)->delete();
            // Send accepted follow request notification to from_user (who has requested the follow)
            UserNotification::create([
                'user_id' => $from_user_id,
                'from_user_id' => $user_id,
                'message' => NotificationController::getMessageForFollowRequestAccepted($user->username),
                'type' => UserNotification::NOTIFICATION_TYPE_REQUEST_ACCEPTED,
            ]);
            // Add from_user as user follower
            $user->followers()->sync($from_user->id);
            // Add user as from_user following
            $from_user->followings()->sync($user->id);
        }
    }

    public static function deleteFollowRequest(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            UserNotification::findOrFail($id)->delete();
        }
    }

    public static function setNotificationsViewed()
    {
        $user_id = Auth::id();
        if ($user_id) {
            $notifications = UserNotification::where('user_id', $user_id)->where('viewed', 0)->get();
            foreach ($notifications as $notification) {
                $notification->viewed = 1;
                $notification->save();
            }
            $group_ids = self::getUserGroupIds();
            $notifications = GroupNotification::whereIn('group_id', $group_ids)->where('viewed', 0)->get();
            foreach ($notifications as $notification) {
                $notification->viewed = 1;
                $notification->save();
            }
        }
    }

    public static function getUserGroupIds(&$user = null)
    {
        $user_group_ids = array();
        if (!$user) {
            $user = Auth::user();
        }

        foreach ($user->groups as $group) {
            $user_group_ids[] = $group->id;
        }
        if ($user) {
            $user->user_group_ids = $user_group_ids;
        }
        return $user_group_ids;
    }

    public static function isUserDeleted(Request $request)
    {
        $email = $request->input('email');
        if ($email) {
            $user = User::withTrashed()->where('email', $email)->first();
            if ($user && $user->trashed()) {
                return response()->json(true);
            }

            return response()->json(false);
        }
        return false;
    }

    public static function sendRecoveryLink(Request $request)
    {
        $email = $request->input('email');
        if ($email) {
            $user = User::withTrashed()->where('email', $email)->first();
            if ($user && $user->trashed()) {
                $recoveryLink = self::generateRecoveryLink();
                DB::table('recovery')->updateOrInsert(
                    ['email' => $user->email, 'user_id' => $user->id],
                    ['url' => $recoveryLink, 'created_at' => now()]
                );
                \Mail::send('emails.recovery', ['link' => $recoveryLink],
                    function ($message) use ($user) {
                        $message->to($user->email);
                        $message->subject('MiDiverse Account Recovery');
                    }
                );
            }
        }
    }

    public static function validateRecoveryToken($token)
    {
        $recoveryLink = self::getRecoveryLink($token);
        $record = DB::table('recovery')->where('url', $recoveryLink)->first();
        if ($record) {
            $currentTimestamp = time();
            $tokenCreationTimestamp = strtotime($record->created_at);
            // Define the token expiration time in seconds: 60 minutes
            $tokenExpirationTime = 60 * 60;
            // Check if the url is not expired
            if (($currentTimestamp - $tokenCreationTimestamp) < $tokenExpirationTime) {
                $user = DB::table('users')->where('id', $record->user_id)->first();
                if ($user && $user->deleted_at) {
                    DB::table('users')->where('id', $record->user_id)->update(['deleted_at' => null]);
                }
                // Delete the recovery record
                DB::table('recovery')->where('url', $recoveryLink)->delete();
                // Auto login
                Auth::loginUsingId($user->id);
                return redirect()->route('home');
            } else {
                return redirect()->route('login');
            }
        } else {
            return redirect()->route('login');
        }
    }

    public static function generateRecoveryLink()
    {
        return env('APP_URL') . '/recover/' . \Str::random(\random_int(10, 25));
    }

    public static function getRecoveryLink($token)
    {
        return env('APP_URL') . '/recover/' . $token;
    }

    public static function bookmark(string $token, Request $request) {
        $type = $request->input('type');
        $user = Auth::user();
        if ($type == 'post') {
            $post = Post::where('token', $token)->first();
            if ($user->postBookmarks()->where('post_id', $post->id)->exists()) {
                $user->postBookmarks()->detach($post->id);
                return response()->json(['message' => 'Post bookmark removed']);
            } else {
                $user->postBookmarks()->attach($post);
                return response()->json(['message' => 'Post bookmarked']);
            }
        } else if ($type == 'comment') {
            $comment = Comment::where('token', $token)->firstOrFail();
            if ($user->commentBookmarks()->where('comment_id', $comment->id)->exists()) {
                $user->commentBookmarks()->detach($comment->id);
                return response()->json(['message' => 'Comment bookmark removed']);
            } else {
                $user->commentBookmarks()->attach($comment);
                return response()->json(['message' => 'Comment bookmarked']);
            }
        }
    }

}
