<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

// 🛑 ELIMINAR ESTA CLASE: Ya no es necesaria, usaremos Storage::fake()
// class FileSystemMock { ... }

class ImageUploadTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    // 🟢 DEFINIMOS EL DISCO DE LA GALERÍA (Necesario si lo usas en el controlador)
    const GALLERY_DISK = 'gallery';

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Simulación de Disco
        // Asumimos que GALLERY_DISK está configurado en filesystems.php
        Storage::fake(self::GALLERY_DISK);

        // 🟢 SIMULAR ARCHIVOS PRE-EXISTENTES USANDO EL DISCO FAKE:
        // Creamos los archivos directamente en el disco simulado.
        Storage::disk(self::GALLERY_DISK)->put('50.jpg', 'dummy');
        Storage::disk(self::GALLERY_DISK)->put('51.jpg', 'dummy');
        Storage::disk(self::GALLERY_DISK)->put('placeholder.txt', 'dummy');

        // 2. Simulación de Autenticación
        $this->user = User::factory()->create();
    }

    // El tearDown ya no necesita File::deleteDirectory si solo usamos Storage::fake

    // =========================================================
    // PRUEBA 1: SUBIDA EXITOSA Y RENOMBRAMIENTO
    // =========================================================

    /** @test */
    public function it_uploads_multiple_images_and_renames_them_sequentially()
    {
        // ARRANGE: Archivos falsos. El maxNumber es 51, los nuevos serán 52.jpg y 53.jpg.
        $file1 = UploadedFile::fake()->image('img_a.jpg')->size(100);
        $file2 = UploadedFile::fake()->image('img_b.png')->size(200);

        // ACT: Petición como usuario autenticado
        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), [
                'file_0' => $file1,
                'file_1' => $file2,
            ]);

        // ASSERT:
        $response->assertStatus(302);

        // 🟢 Verificar la existencia de los nuevos archivos en el disco simulado
        Storage::disk(self::GALLERY_DISK)->assertExists('52.jpg');
        Storage::disk(self::GALLERY_DISK)->assertExists('53.jpg');

        // Verifica el mensaje de éxito
        $response->assertSessionHas('msj', function ($msj) {
            return str_contains($msj['success'], 'Se han subido 2 archivo(s) exitosamente.') && empty($msj['errors']);
        });
    }

    // =========================================================
    // PRUEBA 2: MANEJO DE PETICIÓN SIN ARCHIVOS (Vacío)
    // =========================================================

    /** @test */
    public function it_returns_error_message_when_no_files_are_uploaded()
    {
        $payload = ['extra_data' => 'test'];

        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), $payload);

        $response->assertStatus(302);

        // Verifica el mensaje de fallo específico
        $response->assertSessionHas('msj', function ($msj) {
            return str_contains($msj['success'], 'No se ha subido ningún archivo.');
        });
    }

    // =========================================================
    // PRUEBA 3: FALLO DE ARCHIVO INVÁLIDO
    // =========================================================

    /** @test */
    public function it_records_an_error_message_on_invalid_file()
    {
        // ARRANGE: Payload con un archivo válido y un valor que no es un archivo
        $validFile = UploadedFile::fake()->image('valid.jpg');
        $invalidPayload = [
            'file_0' => $validFile,
            'file_1' => 'esto no es un archivo', // Esto no es UploadedFile y fallará $file->isValid()
        ];

        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), $invalidPayload);

        // ASSERT:
        $response->assertStatus(302);

        // Verifica que se subió 1 archivo y se registró 1 error
        $response->assertSessionHas('msj', function ($msj) {
            $successCondition = str_contains($msj['success'], 'Se han subido 1 archivo(s) exitosamente.');
            $errorCondition = count($msj['errors']) > 0 && str_contains($msj['errors'][0], 'El archivo no es válido o no es un archivo subido.');

            return $successCondition && $errorCondition;
        });

        // El nuevo archivo debe existir (52.jpg)
        Storage::disk(self::GALLERY_DISK)->assertExists('52.jpg');
    }

    // =========================================================
    // PRUEBA 4: FALLO DE SEGURIDAD (No Autenticado)
    // =========================================================

    /** @test */
    public function unauthenticated_user_cannot_upload_images()
    {
        $file = UploadedFile::fake()->image('security_test.jpg')->size(100);

        // ACT: Petición SIN autenticación (usando $this->post)
        $response = $this->post(route('subir.imagen'), ['file_0' => $file]);

        // ASSERT:
        $response->assertRedirect('/login');

        // El disco debe estar vacío, excepto por los archivos iniciales que se crearon en setUp.
        // Pero el archivo de seguridad no debe existir.
        Storage::disk(self::GALLERY_DISK)->assertMissing('52.jpg');
    }
}
