<?php

namespace Database\Seeders;

use App\Models\Empresa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      
       Empresa::factory()->create([
        'RNC'=> '132706498',
        'empresa'=> 'TESORIA SRL',
        'direccion'=> 'C/22A apto N1, Embrujo III, Santiago Rep. Dom.',
        'telefono'=> '809-805-7566',
        'telefono2'=> null
    ]);
    }
}
