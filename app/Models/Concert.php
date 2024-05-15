<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concert extends Model {
    use HasFactory;

    protected $table = 'concerts';

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'live',
        'planificated_at',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function roles() {
        return $this->belongsToMany(Role::class, 'concert_roles');
    }

    public function members() {
        return $this->belongsToMany(User::class, 'concert_members');
    }

    public function likes() {
        return $this->belongsToMany(User::class, 'concert_likes');
    }

    public function midis() {
        return $this->belongsToMany(UserMidi::class, 'concert_midis');
    }

    public function bookmarks() {
        return $this->belongsToMany(User::class, 'user_concert_bookmarks');
    }

    public function invitations() {
        return $this->hasMany(Invitation::class);
    }
}
