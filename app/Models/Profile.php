<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Profile extends Model
{
    protected $table = 'profiles';
    protected $fillable = [
        'user_id',
        'name',
        'lastname', 
        'birthdate', 
        'picture'
    ];
    
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
