<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rol::factory()->create([
            'nombre'=> "Admin",
            'status'=> 1 
        ]);
        
        Rol::factory()->create([
            'nombre'=> "Cliente",
            'status'=> 1 
        ]);

        Rol::factory()->create([
            'nombre'=> "Usuario",
            'status'=> 1 
        ]);
 
    }
}
