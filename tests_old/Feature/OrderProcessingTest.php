<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User; // Asegúrate de importar tus modelos

class OrderProcessingTest extends TestCase
{
    use RefreshDatabase; // Limpia la base de datos después de cada prueba

    /** @test */
    public function a_user_can_submit_a_valid_pedido()
    {
        // 1. Datos de prueba simulando el payload de useForm
        $payload = [
            'nombre' => 'Jose Perez',
            'telefono' => '(809) 555-1234',
            'carrito' => [
                ['codigo' => 'IMG-001.jpg', 'cantidad' => 2, 'comentario' => 'Rojo'],
                ['codigo' => 'IMG-005.jpg', 'cantidad' => 1, 'comentario' => null],
            ],
        ];

        // 2. Ejecutar la petición POST (simulando Inertia)
        $response = $this->post(route('pedido.add'), $payload);

        // 3. Afirmaciones
        
        // Debe ser una redirección exitosa (Inertia suele redireccionar o devolver un 200)
        $response->assertStatus(200); 

        // Asegurar que el pedido fue creado en la DB
        $this->assertDatabaseHas('pedidos', [
            'nombre' => 'Jose Perez',
            'telefono' => '(809) 555-1234',
        ]);
        
        // Asegurar que los artículos del pedido se guardaron correctamente
        $this->assertDatabaseCount('carrito', 2);
    }
}