<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Importar para logging profesional
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class FileController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Subir', [
            'pedidos' => Pedido::all()->sortBy('id')->load('detalle'),
            'user' => auth()->user() ?? [],
        ]);

    }

    public function uploadImages(Request $request)
    {   

        $request->validate([
            // Asumiendo que el input del formulario se llama 'images[]'
            'images' => 'required|array',
            'images.*' => 'file|required|image|max:5120', // Solo JPEG, máximo 5MB
        ],[
            'images.required' => 'Debes seleccionar al menos una imagen para subir.',
            'images.array' => 'El formato de las imágenes subidas no es válido.',
            
            // El asterisco (*) permite aplicar el mensaje a CUALQUIER error en los elementos del array
            'images.*.file' => 'Uno de los elementos no es un archivo válido.',
            'images.*.required' => 'Uno de los archivos subidos está vacío o es nulo.',
            'images.*.image' => 'Uno de los archivos no es un formato de imagen reconocido (JPG, PNG, GIF, etc.).',
            'images.*.max' => 'Uno de los archivos excede el tamaño máximo permitido de 5 MB.',
        ]);

        $manager = new ImageManager(new Driver());

        $disk = Storage::disk('gallery');
        $mensajesExitosos = 0;
        $mensajesErrores = [];
        $maxNumber = $maxNumber = $this->getMaxImageNumber();


        $files = $request->file('images');
        foreach ($files as $index => $file) {
            if ($file instanceof \Illuminate\Http\UploadedFile && $file->isValid()) {
                
                $maxNumber++;
           
                $fileName = $maxNumber . '.webp';
                $thumbName = $maxNumber . '_thumb.webp';

                try {
                    //imagen es webp
                    $image = $manager->read($file);
                    $image->scale(width: 1600);
                    $encodedFull = $image->toWebp(90);
                    $disk->put($fileName, $encodedFull);


                    $thumbnail = $manager->read($file);
                    $thumbnail->cover(400, 400); 
                
                    $encodedThumb = $thumbnail->toWebp(65);
                    $disk->put('thumbs/' . $thumbName, $encodedThumb);


                    //$disk->putFileAs('', $file, $name);
                    $mensajesExitosos ++;
                    unset($image, $thumbnail, $encodedFull, $encodedThumb);
                } catch (\Exception $e) {
                    \Log::error("Error al subir imagen: " . $e->getMessage());
                    $mensajesErrores[] = "Error al subir el archivo: " . $file->getClientOriginalName();
                }
            } else {
                $mensajesErrores[] = "Error: El archivo no es válido o está vacío.";
            }
        }

        if ($mensajesExitosos > 0) {
            $mensaje = 'Se han subido '.$mensajesExitosos.' archivo(s) exitosamente.';
        } else {
            $mensaje = 'No se ha subido ningún archivo.';
        }

        return redirect()->back()->with('msj', ['success' => $mensaje, 'errors' => $mensajesErrores]);

     

    }

    public function eliminar(Request $request)
    {
        $request->validate([
            'codigos' => 'required|array',
            'codigos.*' => 'string'
        ]); 

        /** @var array<string> $files */
        $disk = Storage::disk('gallery'); // 🟢 Usar el disco

        $files = $request->input('codigos');

        $deletionSuccessful = 0;

        try {
            foreach ($files as $fileName) {
                // 3. Verificar y Eliminar
                $fileName =  $fileName;

                if ($disk->exists($fileName)) {

                    // 2. Intentar Eliminar (Si existe, debería funcionar)
                    if ($disk->delete($fileName)) {
                        //Log::info("Archivo eliminado: " . $fileName);
                        $deletionSuccessful++;
                    } else {
                        var_dump('Fallo grave al eliminar archivo existente: '.$fileName);
                        // Fallo de eliminación por permisos, etc.
                        Log::error('Fallo grave al eliminar archivo existente: '.$fileName);
                    }

                }

            }

            return redirect()->back()->with('msj', [
                'success' => true,
                'message' => $deletionSuccessful.' archivos eliminados correctamente.',
                'errors' => [],
            ]);

        } catch (\Throwable $th) {
            // 5. Manejo de Errores
            Log::error('Error al eliminar archivos: '.$th->getMessage());

            return redirect()->back()->with('msj', [
                'message' => 'Error al eliminar archivos: '.$th->getMessage(),
                'errors' => ['error'],
            ]);
        }
    }

     /**
     * Obtiene el número más alto de los archivos .webp en el directorio de imágenes.
     *
     * @param \Illuminate\Contracts\Filesystem\Filesystem $disk
     * @param string $directory
     * @return int
     */
    /**
     * Obtiene el número más alto de los archivos .webp en los directorios de imágenes.
     * Busca recursivamente en la carpeta 'images/' y sus subcarpetas.
     *
     * @param string $baseDirectory La carpeta base donde empezar a buscar (ej: 'images').
     * @return int
     */
    private function getMaxImageNumber(string $baseDirectory = '' ): int
    {
        // Usamos el disco 'public'
        $disk = Storage::disk('gallery'); 

        $filePaths = $disk->allFiles($baseDirectory); 

        $numbers = collect($filePaths)
            ->map(function($path) {
                $fileName = basename($path); 
                
                preg_match('/(\d+)\.webp$/', $fileName, $matches);
                
                return isset($matches[1]) ? (int)$matches[1] : 0; 
            })
            ->filter()
            ->all();

        $max =  max(array_merge([0], $numbers)) ;

        return $max > 10000 ? $max : 10000;
    }
}
