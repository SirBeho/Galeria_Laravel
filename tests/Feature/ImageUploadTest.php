<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem; 
use Tests\TestCase;

// 🛑 ELIMINAR ESTA CLASE: Ya no es necesaria, usaremos Storage::fake()
// class FileSystemMock { ... }

class ImageUploadTest extends TestCase
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

        // 🟢 SIMULAR ARCHIVOS PRE-EXISTENTES USANDO EL DISCO FAKE:
        // Creamos los archivos directamente en el disco simulado.
        $this->disk->put('50.jpg' ,'dummy content 1');
        $this->disk->put('51.jpg' ,'dummy content 1');
        $this->disk->put('placeholder.txt' ,'dummy content 1');
    }

    // =========================================================
    // PRUEBA 1: SUBIDA EXITOSA Y RENOMBRAMIENTO
    // =========================================================

    /** @test */
    public function it_uploads_multiple_images_and_renames_them_sequentially()
    {   
       
        // ARRANGE: Archivos falsos. El maxNumber es 51, los nuevos serán 10000.jpg y 10001.jpg.
        $file1 = UploadedFile::fake()->image('img_a.jpg')->size(100);
        $file2 = UploadedFile::fake()->image('img_b.png')->size(200);

        // ACT: Petición como usuario autenticado
        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), ['images'=>[
                'file_0' => $file1,
                'file_1' => $file2,
            ]]);

        // ASSERT:
        $response->assertStatus(302);

        //ver las imagenes del disco
       // var_dump($this->disk->files());

        // 🟢 Verificar la existencia de los nuevos archivos en el disco simulado
        $this->disk->assertExists('10001.jpg');
        $this->disk->assertExists('10002.jpg');

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
        $payload = ['file_0' , 'test'];

        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), ['images' => $payload]);

        $response->assertStatus(302);

        $response->assertSessionHasErrors(['images.0']);

        $payload = [];

        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), ['images' => $payload]);

        $response->assertStatus(302);

        // Verifica el mensaje de fallo específico
        $response->assertSessionHasErrors([
            'images' => 'Debes seleccionar al menos una imagen para subir.',
        ]);
    }

    // =========================================================
    // PRUEBA 3: FALLO DE ARCHIVO INVÁLIDO
    // =========================================================

    /** @test */
    public function it_records_an_error_message_on_invalid_file()
    {
        // ARRANGE: Payload con un archivo válido y un valor que no es un archivo
        $validFile = UploadedFile::fake()->image('valid.jpg');
        $payload = [
            // Primer elemento: Un archivo válido que debería subirse
            'images' => [
                $validFile, 
                // Segundo elemento: Un string que NO es UploadedFile y fallará la verificación manual
                'esto no es un archivo' 
            ],
        ];

        $response = $this->actingAs($this->user)
            ->post(route('subir.imagen'), $payload);

        // ASSERT:
        $response->assertStatus(302);


        $response->assertSessionHasErrors([
            'images.1'
        ]);


        // Verifica que se subió 1 archivo y se registró 1 error
       /*  $response->assertSessionHas('msj', function ($msj) {
            $successCondition = str_contains($msj['success'], 'Se han subido 1 archivo(s) exitosamente.');
            $errorCondition = count($msj['errors']) > 0 && str_contains($msj['errors'][0], 'El archivo no es válido o no es un archivo subido.');

            return $successCondition && $errorCondition;
        }); */

        // El nuevo archivo no debe existir (52.jpg)
        $this->disk->assertMissing('10003.jpg');
    }

    // =========================================================
    // PRUEBA 4: FALLO DE SEGURIDAD (No Autenticado)
    // =========================================================

    /** @test */
    public function unauthenticated_user_cannot_upload_images()
    {
        $file = UploadedFile::fake()->image('security_test.jpg')->size(100);

        // ACT: Petición SIN autenticación (usando $this->post)
        $response = $this->post(route('subir.imagen'), ['images' =>  ['file_0' => $file]]);

        // ASSERT:
        $response->assertRedirect('/home');

        // El disco debe estar vacío, excepto por los archivos iniciales que se crearon en setUp.
        // Pero el archivo de seguridad no debe existir.
        $this->disk->assertMissing('52.jpg');
    }
}
