<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectMessage extends Model {
    use HasFactory;
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'media'
    ];
    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function receiver() {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
