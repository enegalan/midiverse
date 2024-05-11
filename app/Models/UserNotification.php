<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserNotification extends Model
{
    use HasFactory;
    protected $table = 'user_notifications';
    protected $fillable = [
        'user_id',
        'from_user_id',
        'message',
        'following_notification',
        'viewed',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
