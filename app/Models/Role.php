<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Role extends Model {
    public const ROLE_GUEST = 1;
    public const ROLE_PRO = 2;
    public const ROLE_ADMIN = 3;
    public const ROLE_GROUP_MEMBER = 4;
    public const ROLE_GROUP_OWNER = 5;
    public const ROLE_GROUP_ADMIN = 6;
    public const ROLE_CONCERT_MEMBER = 7;
    public const ROLE_CONCERT_OWNER = 8;
    public const ROLE_CONCERT_ADMIN = 9;
    protected $table = 'roles';

    protected $fillable = [
        'name', 
        'user_id', 
    ];
    
    use HasFactory;

    public function users() {
        return $this->belongsToMany(User::class, 'users_roles');
    }

    public function groups() {
        return $this->belongsToMany(Group::class, 'group_roles');
    }

    public function concerts() {
        return $this->belongsToMany(Concert::class, 'concert_roles');
    }
}
