<?php

namespace Database\Factories;

use App\Models\Detalle;
use App\Models\Pedido;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pedido>
 */
class PedidoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->name(),
            'telefono' => $this->faker->phoneNumber(),
            'status' => 1,
            'numero_pedido' => $this->faker->unique()->numberBetween(1000, 9999),
            'key' => bin2hex(random_bytes(10)), // Clave de acceso
        ];
    }

    /**
     * Define the model's after creating callbacks.
     *
     * @return PedidoFactory
     */
    public function configure()
    {
        // 🟢 CLAVE: Después de crear un pedido, ejecuta esta función.
        
            $detallesCount = rand(2, 3);
            return $this->has(
                Detalle::factory()->count(3), // ⬅️ Crea 2 o 3 detalles
                'detalle' // ⬅️ Nombre del método de relación en el modelo Pedido.
            );
    }
}
