<?php
// tests/Feature/PedidoViewTest.php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Pedido;
use App\Models\User;

class PedidoViewTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================
    // SEGURIDAD DE ACCESO (PROTECCIÓN DE RUTAS)
    // =========================================================

    /** @test */
    public function unauthenticated_user_is_redirected_from_panel()
    {
        // La ruta /panel tiene middleware 'auth'.
        $response = $this->get(route('panel'));

        // Debe ser redirigido a la página de login
        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_user_can_view_panel_and_data_is_loaded()
    {
        $user = User::factory()->create();
        
        // Crear un pedido de prueba para verificar que se cargue
        $pedido = Pedido::factory()->create();

        $response = $this->actingAs($user)->get(route('panel'));

        $response->assertStatus(200);
        
        // Verifica que se renderiza el componente Inertia correcto
        $response->assertInertia(fn ($page) => $page->component('Panel'));
        
        // Verifica que la data de 'pedidos' esté presente
        $response->assertInertia(fn ($page) => 
            $page->has('pedidos', fn ($pedidos) => 
                // Verifica que al menos el pedido de prueba exista
                $pedidos->where('id', $pedido->id)->isNotEmpty()
            )
        );
    }
    
    // =========================================================
    // RUTA DE VISUALIZACIÓN DE PEDIDO (/pedido?p={num}&key={key})
    // =========================================================

    /** @test */
    public function it_shows_pedido_page_with_valid_number_and_key()
    {
        // ARRANGE: Crear un pedido con un numero_pedido y key conocidos
        $pedido = Pedido::factory()->create([
            'numero_pedido' => 500,
            'key' => 'ABCDE12345',
        ]);
        
        // ACT
        $response = $this->get(route('pedido.view', [
            'p' => 500,
            'key' => 'ABCDE12345'
        ]));

        // ASSERT
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Pedido')
                 // Verifica que la data de 'pedido' contiene los detalles correctos
                 ->where('pedido.numero_pedido', 500)
                 ->where('pedido.key', 'ABCDE12345')
        );
    }

    /** @test */
    public function it_denies_access_with_invalid_key_or_number()
    {
        // ARRANGE: Crear un pedido válido
        Pedido::factory()->create([
            'numero_pedido' => 501,
            'key' => 'VALIDKEY',
        ]);
        
        // Caso 1: Número de pedido correcto, clave incorrecta
        $response1 = $this->get(route('pedido.view', [
            'p' => 501,
            'key' => 'INVALIDKEY' 
        ]));

        // Caso 2: Número de pedido incorrecto, clave correcta (o casi)
        $response2 = $this->get(route('pedido.view', [
            'p' => 999, // Inexistente
            'key' => 'VALIDKEY'
        ]));

        // ASSERT: Ambos deben renderizar la página de denegación de acceso (AccessDenied)
        $response1->assertStatus(200);
        $response1->assertInertia(fn ($page) => $page->component('AccessDenied'));
        
        $response2->assertStatus(200);
        $response2->assertInertia(fn ($page) => $page->component('AccessDenied'));
    }
}