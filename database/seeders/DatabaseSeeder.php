<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        //User roles
        \App\Models\Role::factory()->create([
            'name' => 'guest',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'pro',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'admin',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'group_member',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'group_owner',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'group_admin',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'concert_member',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'concert_owner',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'concert_admin',
        ]);
    }
}
