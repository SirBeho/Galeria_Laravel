<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // Asume que tienes un modelo User
use App\Models\Pedido;
use App\Models\Detalle;

class PedidoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pedido1 = Pedido::create([
            'numero_pedido' => 1001,
            'nombre' => 'Juan Perez',
            'telefono' => '(809) 597-2637',
            'key' => bin2hex(random_bytes(10)),
            'status' => 1,
        ]);
        // 🛑 CREAR LOS DETALLES RELACIONADOS
        Detalle::factory()->create([
            'pedido' => $pedido1->id,
            'cantidad' => 10
        ]);
        
        Detalle::factory()->create([
            'pedido' => $pedido1->id,
            'cantidad' => 5,
        ]);

        Pedido::factory()->create([
            'numero_pedido' => 1002,
        ]);
    }
}
