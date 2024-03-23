<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostCommentReply extends Model {
    use HasFactory;

    protected $table = 'post_comment_replies';

    protected $fillable = [
        'post_comment_id',
        'user_id',
        'content',
    ];

    public function comment() {
        return $this->belongsTo(PostComment::class, 'post_comment_id');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function likes() {
        return $this->belongsToMany(User::class, 'post_comment_reply_likes');
    }
}
