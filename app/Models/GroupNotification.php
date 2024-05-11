<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupNotification extends Model
{
    use HasFactory;
    protected $table = 'group_notifications';
    protected $fillable = [
        'group_id',
        'from_user_id',
        'message',
        'following_notification',
        'viewed',
    ];
    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
