<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public static function account () {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Account/Account', compact('user'));
    }

    public static function accountRedirect () {
        return redirect(route('settings.account'));
    }

    public static function privacity() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Privacity/Privacity', compact('user'));
    }

    public static function audienceAndMedia() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Privacity/AudienceAndMedia', compact('user'));
    }

    public static function muteAndBlock() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Privacity/MuteAndBlock', compact('user'));
    }

    public static function notifications() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Notifications/Notifications', compact('user'));
    }

    public static function pushNotifications() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Notifications/Push', compact('user'));
    }

    public static function emailNotifications() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Notifications/Email', compact('user'));
    }

    public static function accessibilityDisplayAndLanguages() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/AccessibilityDisplayAndLanguages/AccessibilityDisplayAndLanguages', compact('user'));
    }

    public static function accessibility() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/AccessibilityDisplayAndLanguages/Accessibility', compact('user'));
    }
    
    public static function display() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/AccessibilityDisplayAndLanguages/Display', compact('user'));
    }

    public static function languages() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/AccessibilityDisplayAndLanguages/Languages', compact('user'));
    }

    public static function language() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/AccessibilityDisplayAndLanguages/Language', compact('user'));
    }

    public static function accountPassword() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Account/Password', compact('user'));
    }

    public static function accountDeactivate() {
        $user = auth()->user();
        app()->call([UserController::class,'loadUserData'], compact('user'));
        return Inertia::render('Settings/Account/Deactivate', compact('user'));
    }

}
