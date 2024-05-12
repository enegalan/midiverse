<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller {
    public static function getRoles() {
        $rol_ids = [
            Role::ROLE_GUEST,
            Role::ROLE_PRO,
            Role::ROLE_ADMIN,
        ];
        return Role::whereIn('id', $rol_ids)->get();
    }

    public static function getGroupRoles() {
        $rol_ids = [
            Role::ROLE_GROUP_MEMBER,
            Role::ROLE_GROUP_ADMIN,
            Role::ROLE_GROUP_OWNER,
        ];
        return Role::whereIn('id', $rol_ids)->get();
    }
    
    public static function getConcertRoles() {
        $rol_ids = [
            Role::ROLE_CONCERT_MEMBER,
            Role::ROLE_CONCERT_ADMIN,
            Role::ROLE_CONCERT_OWNER,
        ];
        return Role::whereIn('id', $rol_ids)->get();
    }
}
