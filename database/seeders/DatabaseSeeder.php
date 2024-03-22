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
            'name' => 'admin',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'guest',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'vip',
        ]);
        \App\Models\Role::factory()->create([
            'name' => 'provider',
        ]);
        //Material #6
        \App\Models\Material::create([
            'name' => 'PLA'
        ]);
        \App\Models\Material::create([
            'name' => 'ABS'
        ]);
        \App\Models\Material::create([
            'name' => 'PETG'
        ]);
        \App\Models\Material::create([
            'name' => 'TPU'
        ]);
        \App\Models\Material::create([
            'name' => 'Nylon'
        ]);
        \App\Models\Material::create([
            'name' => 'PC'
        ]);
        \App\Models\Material::create([
            'name' => 'HIPS'
        ]);
        \App\Models\Material::create([
            'name' => 'Resin'
        ]);
        //Colors #4
        \App\Models\Color::create([
            'name' => 'blue',
            'hex' => '#0250ff',
        ]);
        \App\Models\Color::create([
            'name' => 'orange',
            'hex' => '#f17b01'
        ]);
        \App\Models\Color::create([
            'name' => 'red',
            'hex' => '#c90a0a'
        ]);
        \App\Models\Color::create([
            'name' => 'green',
            'hex' => '#31b529'
        ]);
        \App\Models\Color::create([
            'name' => 'purple',
            'hex' => '#770bd9'
        ]);
        //Categories for proucts_cob #2
        \App\Models\Category::create([
            'name' => 'decoration'
        ]);
        \App\Models\Category::create([
            'name' => 'spares'
        ]);
        \App\Models\Category::create([
            'name' => 'games'
        ]);
        //Product & Cart
        \App\Models\Product::factory(100)->create();
        \App\Models\Country::factory(40)->create();
        \App\Models\Region::factory(20)->create();
    }
}
