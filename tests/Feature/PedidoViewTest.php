<?php

// tests/Feature/PedidoViewTest.php

namespace Tests\Feature;

use App\Models\Pedido;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

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
        $response->assertRedirect(route('home'));
    }

    /** @test */
    public function authenticated_user_can_view_panel_and_data_is_loaded()
    {
        $user = User::factory()->create();

        // Crear un pedido de prueba para verificar que se cargue
        $pedido1 = Pedido::factory()->create();
        $pedido2 = Pedido::factory()->create();
        
        $response = $this->actingAs($user)->get(route('panel'));

        $response->assertStatus(200);

        // Verifica que se renderiza el componente Inertia correcto
        $response->assertInertia(function (AssertableInertia $page) use ($pedido1,$user) {
            
            // 1. Verificar la clave principal 'pedidos' y su tamaño (debe ser 2)
            $page->has('pedidos', 2) 
            
            // 2. Anidación: Entrar al primer pedido (índice 0) para verificar su estructura
            ->has('pedidos.0', function (AssertableInertia $pedido) use ($pedido1) {
                
                // 3. Verificar propiedades del Pedido Padre (Pedido #1)
                $pedido->where('id', $pedido1->id)
                       ->where('numero_pedido', '10000')

                       // 4. Verificar la colección anidada 'detalle' (debe tener 3 ítems)
                       ->has('detalle', 3) 
                       
                       // 5. Verificar la estructura de un elemento del detalle (índice 0)
                       ->has('detalle.0', function (AssertableInertia $detalleItem)  use ($pedido1){
                           // Verificar que el detalle tiene las claves correctas
                           
                           $detalleItem->hasAll(['id', 'pedido', 'codigo', 'cantidad', 'comentario'])
                                       ->where('pedido', $pedido1->id) // Clave foránea correcta
                                       ->etc(); 
                       })
                       ->etc(); // Permite otras propiedades en el modelo Pedido
            })
            // Opcional: Podrías verificar 'pedidos.1' de forma similar si lo necesitas.
            ->where('pedidos.1.numero_pedido', '10001') 
            ->etc(); // Permite otras props del Panel
        });
    }

    // =========================================================
    // RUTA DE VISUALIZACIÓN DE PEDIDO (/pedido?p={num}&key={key})
    // =========================================================

    /** @test */
    public function it_shows_pedido_page_with_valid_number_and_key()
    {
        // ARRANGE: Crear un pedido con un numero_pedido y key conocidos
        $pedido = Pedido::factory()->create([
            'key' => 'ABCDE12345',
        ]);

        $response = $this->get(route('pedido.view', [
            'p' => 10000,
            'key' => 'ABCDE12345',
        ]));

        // ASSERT
        $response->assertStatus(200);

        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Pedido')
            ->has('pedido', fn (AssertableInertia $pedido) => $pedido 
                ->hasAll(['telefono', 'status', 'numero_pedido', 'key'])
                ->where('numero_pedido', '10000')
                ->where('key', 'ABCDE12345')
                ->where('status', 1) 
                ->etc()
            ) 
        );

      
    }

    /** @test */
    public function it_denies_access_with_invalid_key_or_number()
    {
        // ARRANGE: Crear un pedido válido
        Pedido::factory()->create([
            'key' => 'VALIDKEY',
        ]);

        // Caso 1: Número de pedido correcto, clave incorrecta
        $response1 = $this->get(route('pedido.view', [
            'p' => 10000,
            'key' => 'INVALIDKEY',
        ]));

        // Caso 2: Número de pedido incorrecto, clave correcta (o casi)
        $response2 = $this->get(route('pedido.view', [
            'p' => 999, // Inexistente
            'key' => 'VALIDKEY',
        ]));

        // ASSERT: Ambos deben renderizar la página de denegación de acceso (AccessDenied)
        $response1->assertStatus(200);
        $response1->assertInertia(fn ($page) => $page->component('AccessDenied'));

        $response2->assertStatus(200);
        $response2->assertInertia(fn ($page) => $page->component('AccessDenied'));
    }
}
