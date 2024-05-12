<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserNotification extends Model
{
    use HasFactory;
    public const NOTIFICATION_TYPE_FOLLOW = 0;
    public const NOTIFICATION_TYPE_LIKE = 1;
    public const NOTIFICATION_TYPE_BOOKMARK = 2;
    public const NOTIFICATION_TYPE_COMMENT = 3;
    public const NOTIFICATION_TYPE_ROL = 4;
    public const NOTIFICATION_TYPE_REQUEST_ACCEPTED = 5;
    protected $table = 'user_notifications';
    protected $fillable = [
        'user_id',
        'from_user_id',
        'message',
        'following_notification',
        'viewed',
        'type',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
