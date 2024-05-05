<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Profile;
use App\Models\Role;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements MustVerifyEmail {
    use HasApiTokens, HasFactory, Notifiable, softDeletes;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'lastname',
        'birthdate',
        'password',
        'description',
        'avatar',
        'sub',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    public function roles(){
        return $this->belongsToMany(Role::class, 'users_roles', 'user_id', 'role_id');
    }

    public function hasRole($role) {
        return $this->roles()->where('name', $role)->exists();
    }

    public function adminAccess() {
        return $this->hasRole('admin');
    }

    public function proAccess() {
        return $this->hasRole('pro');
    }

    public function followers() {
        return $this->belongsToMany(User::class, 'user_followers', 'user_id', 'follower_id');
    }

    public function followings() {
        return $this->belongsToMany(User::class, 'user_followers', 'follower_id', 'user_id');
    }

    public function groups() {
        return $this->belongsToMany(Group::class, 'group_members');
    }

    public function group_followings() {
        return $this->belongsToMany(Group::class, 'group_followers', 'follower_id', 'group_id');
    }

    public function concerts() {
        return $this->hasMany(Concert::class);
    }

    public function posts() {
        return $this->hasMany(Post::class);
    }

    public function midis() {
        return $this->hasMany(UserMidi::class);
    }

    public function postBookmarks() {
        return $this->belongsToMany(Post::class, 'user_post_bookmarks');
    }

    public function concertBookmarks() {
        return $this->belongsToMany(Concert::class, 'user_concert_bookmarks');
    }

    /**
     * Get the email address that should be used for verification.
     *
     * @return string
     */
    public function getEmailForVerification() {
        return $this->email;
    }
}
