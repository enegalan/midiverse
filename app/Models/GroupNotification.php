<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupNotification extends Model {
    public const NOTIFICATION_TYPE_FOLLOW = 0;
    public const NOTIFICATION_TYPE_LIKE = 1;
    public const NOTIFICATION_TYPE_BOOKMARK = 2;
    public const NOTIFICATION_TYPE_COMMENT = 3;
    public const NOTIFICATION_TYPE_ROL = 4;
    public const NOTIFICATION_TYPE_REQUEST_ACCEPTED = 5;
    use HasFactory;
    protected $table = 'group_notifications';
    protected $fillable = [
        'group_id',
        'from_user_id',
        'message',
        'following_notification',
        'viewed',
        'type',
    ];
    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
