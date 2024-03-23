<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMidi extends Model
{
    use HasFactory;

    protected $table = 'user_midis';

    protected $fillable = [
        'user_id',
        'midi',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function groups() {
        return $this->belongsToMany(Group::class, 'group_midis');
    }

    public function concerts() {
        return $this->belongsToMany(Concert::class, 'concert_midis');
    }
}
