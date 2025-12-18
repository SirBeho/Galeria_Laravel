<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem; 
use Tests\TestCase;

class ImageDeleteTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected Filesystem $disk;
    const GALLERY_DISK = 'gallery';

    protected function setUp(): void
    {
        parent::setUp();
        // 1. Crear el usuario para la autenticación
        $this->user = User::factory()->create();

        // 2. Simular el disco (crea una carpeta temporal y la vincula a 'gallery')
        Storage::fake(self::GALLERY_DISK);
        $this->disk = Storage::disk(self::GALLERY_DISK); 

    }

    // =========================================================
    // PRUEBA 1: ELIMINACIÓN EXITOSA
    // =========================================================

    /** @test */
    public function it_deletes_specified_images_via_named_route()
    {
        // ARRANGE: Crear archivos reales en el disco simulado
        $file1 = '100.jpg';
        $file2 = '101.jpg';
        $file3 = '102.jpg';

        // Usamos Storage::put para crear los archivos en el disco 'gallery' fake
        $this->disk->put($file1 ,'dummy content 1');
        $this->disk->put($file2 ,'dummy content 1');
        $this->disk->put($file3 ,'dummy content 1');

        // Verificar que existen antes del test
        $this->disk->assertExists($file1);
        $this->disk->assertExists($file2);
        $this->disk->assertExists($file3);

        $filePaths = $this->disk->allFiles(); 

        // ACT: Ejecutar la petición de eliminación
        $response = $this->actingAs($this->user)
            ->post(route('eliminar.imagen'), [ 
                'codigos' => [$file1, $file2]
            ]);

        // ASSERT:

        // 1. Verificar la redirección y el mensaje flash (clave 'msj')
        $response->assertStatus(302)
            ->assertSessionHas('msj', function ($msj) {
                // 🟢 El mensaje debe indicar 2 archivos eliminados
                $messageMatch = str_contains($msj['message'], '2 archivos eliminados correctamente.');

                return $msj['success'] === true && empty($msj['errors']) && $messageMatch;
            });

        // 2. Verificar que los archivos eliminados ya NO EXISTEN
        $this->disk->assertMissing($file1);
        $this->disk->assertMissing($file2);

        // 3. Verificar que el archivo restante SÍ EXISTE
        $this->disk->assertExists($file3);
    }

    // =========================================================
    // PRUEBA 2: FALLO DE VALIDACIÓN (Payload Inválido o Ausente)
    // =========================================================

    /** @test */
    public function it_returns_validation_error_on_missing_or_invalid_codigos()
    {
        // ACT 1: Intenta eliminar sin enviar 'codigos' (falla en 'required')
        $response = $this->actingAs($this->user)
            ->post(route('eliminar.imagen'), []);

        // ASSERT 1: Debe fallar la validación y redirigir con errores de sesión
        $response->assertStatus(302)
            ->assertSessionHasErrors('codigos');

        // ACT 2: Intenta eliminar enviando 'codigos' que no son strings
        $response = $this->actingAs($this->user)
            ->post(route('eliminar.imagen'), [
                'codigos' => [123, 456], // No son strings
            ]);

        // ASSERT 2: Debe fallar la validación (codigos.* debe ser string)
        $response->assertStatus(302)
            ->assertSessionHasErrors('codigos.0'); // Laravel reporta el error en el primer elemento
    }

    // =========================================================
    // PRUEBA 3: MANEJO DE ARCHIVO INEXISTENTE
    // =========================================================

    /** @test */
    public function it_handles_deletion_of_nonexistent_files_without_crashing()
    {
        // ARRANGE: Solo existe '100.jpg'. 'inexistente.jpg' no existe.
        $file4 = '104.jpg';
        $inexistente = 'inexistente.jpg';

        // Solo creamos el archivo existente
        $this->disk->put($file4, 'dummy content 1');

        // Confirmación para el test:
        $this->disk->assertExists($file4); // DEBE pasar
        $this->disk->assertMissing($inexistente); // DEBE pasar

        // ACT: Intenta eliminar ambos archivos
        $response = $this->actingAs($this->user)
            ->post(route('eliminar.imagen'), [
                'codigos' => [$file4, $inexistente]
            ]);

        // ASSERT:
        // 1. Verifica que el controlador no crashéa (no retorna 500)
        $response->assertStatus(302);


        // 2. Verifica que el mensaje refleje 1 archivo eliminado (el único existente)
        $response->assertSessionHas('msj', function ($msj) {
            return str_contains($msj['message'], '1 archivos eliminados correctamente.') && $msj['success'] === true;
        });

        // 3. El archivo existente fue eliminado
        $this->disk->assertMissing($file4);

        // 4. El archivo que nunca existió sigue sin existir (assertMissing por redundancia, aunque ya no hace falta)
        $this->disk->assertMissing($inexistente);
    }
}
