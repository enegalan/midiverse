<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutedUser extends Model
{
    use HasFactory;
    protected $table = 'muted_users';
    protected $fillable = [
        'id',
        'user_id',
        'muted_user_id',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'users');
    }

    public function mutedUser() {
        return $this->belongsTo(User::class, 'users');
    }
}
