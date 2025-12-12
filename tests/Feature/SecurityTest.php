<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function unauthenticated_user_is_redirected_from_panel()
    {
        // 1. ACT: Intenta acceder al panel sin iniciar sesión
        $response = $this->get(route('panel'));

        // 2. ASSERT: Debe ser redirigido a la página de login (ruta con middleware 'auth')
        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_user_can_view_panel()
    {
        // 1. ARRANGE: Crear un usuario y autenticarlo
        $user = User::factory()->create();
        
        // 2. ACT: Acceder al panel como usuario logueado
        $response = $this->actingAs($user)->get(route('panel'));

        // 3. ASSERT: Debe ser exitoso y renderizar la página de Inertia 'Panel'
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Panel'));
    }
}