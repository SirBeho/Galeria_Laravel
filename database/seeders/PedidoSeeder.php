<?php

namespace Database\Seeders;

use App\Models\Detalle;
use App\Models\Pedido; // Asume que tienes un modelo User
use App\Models\User;
use Illuminate\Database\Seeder;

class PedidoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pedido1 = Pedido::create([
            'nombre' => 'Juan Perez',
            'telefono' => '(809) 597-2637',
            'key' => bin2hex(random_bytes(10)),
            'status' => 1,
        ]);
        // 🛑 CREAR LOS DETALLES RELACIONADOS
        Detalle::factory()->create([
            'pedido' => $pedido1->id,
            'cantidad' => 10,
        ]);

        Detalle::factory()->create([
            'pedido' => $pedido1->id,
            'cantidad' => 5,
        ]);

        Pedido::factory()->create();

        $this->command->info('✅ Pedidos Creados".');
    }
}
