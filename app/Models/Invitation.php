<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory;
    protected $table = 'invitations';
    protected $fillable = [
        'url',
        'user_id',
        'group_id',
        'concert_id',
    ];
    public function user() {
        return $this->belongsTo(User::class);
    }
    public function group() {
        return $this->belongsTo(Group::class);
    }
    public function concert() {
        return $this->belongsTo(Concert::class);
    }
}
