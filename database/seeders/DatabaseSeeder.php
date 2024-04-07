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
            'title' => 'Guest',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'pro',
            'title' => 'Pro',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'admin',
            'title' => 'Administrator',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'group_member',
            'title' => 'Member',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'group_owner',
            'title' => 'Owner',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'group_admin',
            'title' => 'Administrator',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'concert_member',
            'title' => 'Member',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'concert_owner',
            'title' => 'Owner',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'concert_admin',
            'title' => 'Administrator',
        ]);
    }
}
