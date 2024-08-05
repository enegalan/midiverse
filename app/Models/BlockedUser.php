<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedUser extends Model
{
    use HasFactory;
    protected $table = 'blocked_users';
    protected $fillable = [
        'id',
        'user_id',
        'blocked_user_id',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'users');
    }

    public function blockedUser() {
        return $this->belongsTo(User::class, 'users');
    }
}
