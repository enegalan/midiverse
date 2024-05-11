<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model {
    use HasFactory;

    protected $table = 'groups';

    protected $fillable = [
        'name',
        'description',
        'visibility',
        'logo',
        'banner'
    ];

    public function members() {
        return $this->belongsToMany(User::class, 'group_members');
    }

    public function followers() {
        return $this->belongsToMany(User::class, 'group_followers', 'group_id', 'follower_id');
    }

    public function roles() {
        return $this->belongsToMany(Role::class, 'group_roles')->withPivot(['user_id']);
    }

    public function concerts() {
        return $this->hasMany(Concert::class);
    }

    public function midis() {
        return $this->belongsToMany(UserMidi::class, 'group_midis');
    }

    public function notifications() {
        return $this->hasMany(GroupNotification::class);
    }
}
