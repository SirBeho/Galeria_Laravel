<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Assert as PHPUnit;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;
use App\Models\Pedido; // Asegúrate de importar tu modelo Pedido

class OrderProcessingTest extends TestCase
{
    use RefreshDatabase; // Usar SQLite en memoria y migrar tablas

    /** @test */
    public function a_user_can_submit_a_valid_pedido_and_get_a_success_redirect()
    {
        /* 1. Setup: Define el payload*/
        $payload = [
            'nombre' => 'Jose Perez',
            'telefono' => '(809) 555-1234',
            'carrito' => [
                ['codigo' => 'IMG-001.jpg', 'cantidad' => 2, 'comentario' => 'Rojo'],
                ['codigo' => 'IMG-005.jpg', 'cantidad' => 1, 'comentario' => null],
            ],
        ];

        // 2. Execution: Se ejecuta la petición POST
        $headers = [ 'Host' => 'example.test' ]; 
        $response = $this->post(route('pedido.add'), $payload, $headers);
        
        // =========================================================
        // ASERCIONES DE ESTRUCTURA (HTTP & DB)
        // =========================================================
        
        // A. Redirección y mensaje superior
        $response->assertStatus(302)
                 ->assertSessionHas('success', 'Pedido creado Correctamente.')
                 ->assertSessionHas('pedido_status'); // Verifica que la clave principal existe
        
        // B. Base de Datos
        $this->assertDatabaseHas('pedido', [
            'nombre' => 'Jose Perez',
            'telefono' => '(809) 555-1234',
        ]);
        $this->assertDatabaseCount('detalle', 2); 
        
        // =========================================================
        // ASERCIONES DE CONTENIDO (Flash Data Detallado)
        // =========================================================

        // 3. Extracción de datos para validación anidada (Una sola vez)
        $sessionData = Session::get('pedido_status');
        $pedidoObject = $sessionData['pedido']; 
        
        // A. Validar Link de WhatsApp
        $this->assertArrayHasKey('whatsappLink', $sessionData);
        PHPUnit::assertStringContainsString('https://wa.me/', $sessionData['whatsappLink']);
        
        // B. Validar Número de Pedido
        $this->assertArrayHasKey('numero_pedido', $pedidoObject);
        PHPUnit::assertIsNumeric($pedidoObject->numero_pedido);
        
        // C. Validar Mensaje de Status
        $this->assertArrayHasKey('message', $sessionData);
        $this->assertEquals('Pedido creado correctamente', $sessionData['message']);
    }

    // En Tests\Feature\OrderProcessingTest.php

/** @test */
public function it_returns_validation_error_on_missing_required_fields()
{
    // Caso 1: Falta 'nombre'
    $payload1 = [
        'nombre' => '', // Faltante
        'telefono' => '(809) 555-1234',
        'carrito' => [['codigo' => 'IMG-001.jpg', 'cantidad' => 2]],
    ];
    
    $response1 = $this->post(route('pedido.add'), $payload1);
    $response1->assertStatus(302)
              ->assertSessionHasErrors(['nombre']);

    // Caso 2: Falta 'telefono'
    $payload2 = [
        'nombre' => 'Jose Perez',
        'telefono' => '', // Faltante
        'carrito' => [['codigo' => 'IMG-001.jpg', 'cantidad' => 2]],
    ];

    $response2 = $this->post(route('pedido.add'), $payload2);
    $response2->assertStatus(302)
              ->assertSessionHasErrors(['telefono']);

    // Asegura que no se creó ningún pedido en la base de datos
    $this->assertDatabaseCount('pedido', 0);

}

// En Tests\Feature\OrderProcessingTest.php

/** @test */
public function it_returns_validation_error_and_302__if_carrito_is_null()
{
    // El controlador captura una excepción si 'carrito' es null y devuelve JSON 500.
    $basePayload = [
        'nombre' => 'Test User',
        'telefono' => '123456789',
    ];

    // -------------------------------------------------------------------
    // Caso 1: 'carrito' está AUSENTE (Falla por 'required')
    // -------------------------------------------------------------------
    
    // ACT
    $response_missing = $this->post(route('pedido.add'), $basePayload);
    
    // ASSERT: Espera 302 y el mensaje personalizado
    $response_missing->assertStatus(302)
                     ->assertSessionHasErrors(['carrito']);
                     
    // Validar el mensaje personalizado para 'carrito.required'
    $errors = session('errors')->getBag('default')->get('carrito');
    $this->assertContains('El carrito no puede estar vacío.', $errors);

    $payload_empty = array_merge($basePayload, ['carrito' => []]);
        
        // ACT
        $response_empty = $this->post(route('pedido.add'), $payload_empty);
        
        // ASSERT: Espera 302 y el mensaje personalizado (carrito.min)
        $response_empty->assertStatus(302)
                       ->assertSessionHasErrors(['carrito']);
                       
        // Validar el mensaje personalizado para 'carrito.min'
        $errors = session('errors')->getBag('default')->get('carrito');
        $this->assertContains('El carrito debe contener al menos un artículo.', $errors);

        $this->assertDatabaseCount('pedido', 0);
}

 /** @test */
 public function it_updates_pedido_status_via_status_endpoint()
 {
     // ARRANGE: Crear un pedido con estado inicial 1
     $pedido = Pedido::factory()->create(['status' => 1]);
 
     $newStatus = 2; // El nuevo estado a asignar
 
     // ACT: Llamar al endpoint 'status'
     // Asume que la ruta se llama 'pedido.status'
     $response = $this->post(route('pedido.status'), [
         'id' => $pedido->id,
         'status' => $newStatus,
     ]);
 
     // ASSERT:
     // 1. El método 'status' devuelve 200 OK en caso de éxito.
     $response->assertStatus(200); 
 
     // 2. Verificar que la base de datos se actualizó correctamente
     $this->assertDatabaseHas('pedido', [
         'id' => $pedido->id,
         'status' => $newStatus,
     ]);
 }

  /** @test */
 public function it_updates_pedido_status_to_sent_via_sent_endpoint()
{
    // ARRANGE: Crear un pedido con estado 1 (pendiente)
    $pedido = Pedido::factory()->create(['status' => 1]);

    // ACT: Llamar al endpoint 'sent' (debería cambiar el estado a 2)
    // Asumimos que la ruta 'pedido.sent' llama a PedidoController::sent
    $response = $this->post(route('pedido.sent'), [
        'id' => $pedido->id,
    ]);

    // ASSERT: El endpoint 'sent' no devuelve contenido (200 OK o 204 No Content)
    $response->assertStatus(200); 

    // Verifica que la base de datos se actualizó
    $this->assertDatabaseHas('pedido', [
        'id' => $pedido->id,
        'status' => 2, // Asumiendo que 2 es el estado 'enviado'
    ]);
}

/** @test */
public function status_endpoint_fails_validation_on_missing_or_invalid_data()
{
    // Caso 1: Falta 'status'
    $response1 = $this->post(route('pedido.status'), ['id' => 1]);
    $response1->assertStatus(302)
              ->assertSessionHasErrors(['status']);

    // Caso 2: 'status' no es numérico
    $response2 = $this->post(route('pedido.status'), ['id' => 1, 'status' => 'ABC']);
    $response2->assertStatus(302)
              ->assertSessionHasErrors(['status']);

    // Caso 3: 'id' es inválido (ej. null, si la validación es robusta)
    // (Asumimos que el controlador valida 'id' como required)
    $response3 = $this->post(route('pedido.status'), ['id' => null, 'status' => 3]);
    $response3->assertStatus(302)
              ->assertSessionHasErrors(['id']);
}

}
