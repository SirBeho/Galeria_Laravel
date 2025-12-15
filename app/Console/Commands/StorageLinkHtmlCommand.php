<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File; 
use Illuminate\Filesystem\Filesystem;

class StorageLinkHtmlCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:link-html';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea el enlace simbólico para el almacenamiento usando public_html.';

    /**
     * Execute the console command.
     */
    public function handle(Filesystem $files)
    {
        // 1. Definir rutas (relativas a la raíz del proyecto)
        $target = storage_path('app/public'); // Donde están los archivos reales
        $link = base_path('public_html/storage'); // Donde queremos que se cree el enlace

        // 2. Eliminar enlace existente si existe
        if ($files->exists($link)) {
            $files->delete($link);
            $this->info("Enlace simbólico 'public_html/storage' existente eliminado.");
        }

        // 3. Crear el nuevo enlace simbólico
        try {
            // Usamos symlink nativo de PHP para forzar el enlace
            if (!symlink($target, $link)) {
                $this->error('Fallo al crear el enlace simbólico. Verifica permisos y rutas.');
                return 1;
            }

            // 4. Establecer permisos de lectura/ejecución (necesario en algunos hostings)
            File::chmod($target, 0755);
            
            $this->info("El enlace simbólico [public_html/storage] ha sido creado con éxito.");
            
            // Opcional: Ejecutar el link nativo de Laravel por si acaso
            $this->call('storage:link'); 

            return 0;
        } catch (\Exception $e) {
            $this->error('Error durante la creación del enlace: ' . $e->getMessage());
            return 1;
        }
    }
}
