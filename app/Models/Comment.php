<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model {
    protected $table = 'comments';
    protected $fillable = [
        'id',
        'post_id',
        'user_id',
        'parent_id',
        'body',
        'token',
        'created_at',
        'updated_at',
        'comments_visibility',
    ];
    use HasFactory;
    public function post() {
        return $this->belongsTo(Post::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function parent() {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies() {
        return $this->hasMany(Comment::class, 'parent_id');
    }
}
