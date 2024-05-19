<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\CommentController;
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
    Route::get('/home', [MainController::class, 'home'])->name('home');
    
    Route::get('/explore', [MainController::class, 'explore'])->name('explore');
    
    Route::get('/concerts', [MainController::class, 'concerts'])->name('concerts');
    
    Route::get('/playground', [MainController::class, 'playground'])->name('playground');

    Route::get('/notifications', [MainController::class, 'notifications'])->name('notifications');
    
    Route::get('/messages', [MainController::class, 'messages'])->name('messages');

    Route::get('/u/{username}', [UserController::class, 'getProfile'])->name('profile');

    // Profile
    Route::get('/profile', [MainController::class, 'profileRedirect']);
    Route::post('/user/profile/update', [UserController::class, 'updateAuthUserProfile'])->name('user.update.profile');

    // Follows
    Route::get('/u/{username}/following', [UserController::class,'renderUserFollowings'])->name('render.user.following');
    Route::get('/u/{username}/followers', [UserController::class,'renderUserFollowers'])->name('render.user.followers');
    Route::get('/g/{name}/followers', [GroupController::class,'renderGroupFollowers'])->name('render.group.followers');
    Route::get('/g/{name}/members', [GroupController::class,'renderGroupMembers'])->name('render.group.members');

    // Store Midi
    Route::post('/midi/create', [UserController::class,'storeMidi'])->name('store.midi');
    
    // Groups
    Route::get('/groups', [UserController::class,'renderGroups'])->name('render.groups');
    Route::post('/group/create', [GroupController::class,'store'])->name('groups.store');
    Route::post('/group/edit/{name}', [GroupController::class,'update'])->name('groups.update');
    Route::delete('/group/delete/{name}', [GroupController::class,'delete'])->name('group.delete');
    Route::get('/g/{name}', [GroupController::class,'getProfile'])->name('group.profile');
    Route::post('/group/invite/people', [GroupController::class, 'invitePeople'])->name('group.invite.people');
    Route::post('/group/member/delete', [GroupController::class, 'deleteMember'])->name('group.member.delete');
    Route::post('/group/roles/edit', [GroupController::class, 'updateRoles'])->name('group.roles.edit');

    // Posts
    Route::post('/post/create', [PostController::class,'store'])->name('post.create');
    Route::post('/post/like/{id}', [PostController::class, 'like'])->name('post.like');
    Route::get('/post/{token}', [PostController::class, 'show'])->name('posts.show');
    Route::post('/post/{token}/comment', [CommentController::class, 'store'])->name('comments.store');
    // Comments
    Route::get('/comment/{token}', [CommentController::class, 'show'])->name('comments.show');
    Route::put('/comment/{token}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{token}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/comment/like/{token}', [CommentController::class, 'like'])->name('comment.like');
    /* 
        Settings
    */
    Route::get('/settings', [SettingsController::class, 'accountRedirect'])->name('settings.redirect.account');
    // Account
    Route::get('/settings/account', [SettingsController::class, 'account'])->name('settings.account');
    Route::get('/settings/account/password', [SettingsController::class, 'accountPassword'])->name('settings.account.password');
    Route::get('/settings/account/deactivate', [SettingsController::class, 'accountDeactivate'])->name('settings.account.deactivate');
    Route::delete('/account/deactivate', [UserController::class, 'destroy'])->name('account.destroy');
    // Privacity
    Route::get('/settings/privacity', [SettingsController::class, 'privacity'])->name('settings.privacity');
    Route::get('/settings/privacity/audience_and_media', [SettingsController::class, 'audienceAndMedia'])->name('settings.privacity.audienceandmedia');
    Route::get('/settings/privacity/mute_and_block', [SettingsController::class, 'muteAndBlock'])->name('settings.privacity.muteandblock');
    // Notifications
    Route::get('/settings/notifications', [SettingsController::class, 'notifications'])->name('settings.notifications');
    Route::get('/settings/notifications/push', [SettingsController::class, 'pushNotifications'])->name('settings.notifications.push');
    Route::get('/settings/notifications/email', [SettingsController::class, 'emailNotifications'])->name('settings.notifications.email');
    // Accessibility
    Route::get('/settings/accessibility_display_and_languages', [SettingsController::class, 'accessibilityDisplayAndLanguages'])->name('settings.accessibility_display_and_languages');
    Route::get('/settings/accessibility_display_and_languages/accessibility', [SettingsController::class, 'accessibility'])->name('settings.accessibility_display_and_languages.accessibility');
    Route::get('/settings/accessibility_display_and_languages/display', [SettingsController::class, 'display'])->name('settings.accessibility_display_and_languages.display');
    Route::get('/settings/accessibility_display_and_languages/languages', [SettingsController::class, 'languages'])->name('settings.accessibility_display_and_languages.languages');
    Route::get('/settings/accessibility_display_and_languages/language', [SettingsController::class, 'language'])->name('settings.accessibility_display_and_languages.language');
    

    // Get Data Routes
    Route::get('/user/following/{username}', [UserController::class, 'isFollowing'])->name('user.is.following');
    Route::post('/user/password/verify', [UserController::class, 'verifyPassword'])->name('user.verify.password');
    Route::get('/group/name/exists/', [GroupController::class, 'existsByName'])->name('group.exists.name');
    Route::get('/group/following/{name}', [GroupController::class, 'isFollowing'])->name('group.exists.name');
    Route::post('/user/requested/follow/', [UserController::class, 'hasSentFollowRequest'])->name('user.sent.follow');
    Route::post('/group/requested/follow', [GroupController::class, 'hasSentFollowRequest'])->name('group.sent.follow');
    // Follow
    Route::post('/user/follow/{username}', [UserController::class,'toggleFollow'])->name('user.follow');
    Route::post('/group/follow/{name}', [GroupController::class,'toggleFollow'])->name('group.follow');
    Route::post('/user/request/follow/accept', [UserController::class, 'acceptFollowRequest'])->name('user.accept.follow');
    Route::post('/user/notification/delete', [UserController::class, 'deleteFollowRequest'])->name('user.delete.follow');
    Route::post('/group/request/follow/accept', [GroupController::class, 'acceptFollowRequest'])->name('group.accept.follow');
    Route::post('/group/request/invite/accept', [GroupController::class, 'acceptInvite'])->name('group.accept.invite');
    Route::post('/group/notification/delete', [GroupController::class, 'deleteFollowRequest'])->name('group.delete.follow');
    // Protect
    Route::post('/user/set/private', [UserController::class, 'setSessionPrivate'])->name('user.set.private');
    // Invitations
    Route::post('/group/generate/invite', [InvitationController::class, 'generateGroupInvite'])->name('group.generate.invite');
    Route::get('/group/invite/{token}', [InvitationController::class, 'acceptGroupInvite'])->name('group.accept.invite');
});
// Redirect routes
Route::get('/', [MainController::class, 'rootRedirect']);

// Public Routes
Route::get('/user/email/exists/', [UserController::class,'existsByEmail'])->name('user.exists.email');
Route::post('/user/auth/type', [UserController::class, 'getAuthType'])->name('user.auth.type');
Route::post('/user/deleted/', [UserController::class, 'isUserDeleted'])->name('is.user.deleted');
Route::post('/user/send/recovery', [UserController::class, 'sendRecoveryLink'])->name('send.recovery.link');
Route::get('/recover/{token}', [UserController::class, 'validateRecoveryToken'])->name('user.recover');

require __DIR__ . '/auth.php';
