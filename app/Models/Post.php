<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model {
    use HasFactory;

    protected $table = 'posts';

    protected $fillable = [
        'user_id',
        'user_midi_id',
        'content',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function midi() {
        return $this->belongsTo(UserMidi::class, 'user_midi_id');
    }

    public function likes() {
        return $this->belongsToMany(User::class, 'post_likes');
    }

    public function comments() {
        return $this->hasMany(PostComment::class);
    }

    public function bookmarks() {
        return $this->belongsToMany(User::class, 'user_post_bookmarks');
    }
}
