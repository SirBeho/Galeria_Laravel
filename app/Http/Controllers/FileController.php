<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Empresa;
use App\Models\Pedido;
use function Laravel\Prompts\error;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Session;


class FileController extends Controller
{
         
    public function index(Request $request)
    {
        $mensaje = session('msj');
            if ($mensaje) {
                Session::forget('msj');
            }


        return Inertia::render('Subir',[
            'pedidos'=> Pedido::all()->sortBy('id')->load('detalle'),
            'user' => auth()->user() ?? [],
            'mensaje' => $mensaje
        ]);
        
    }



    public function uploadImages(Request $request)
    {

        $disk = Storage::disk('public');
        $directory = 'images';
        
        $mensajesExitosos = 0;
        $mensajesErrores = [];

    
        $maxNumber = $maxNumber = $this->getMaxImageNumber('images');
        
        foreach ($request->all() as $index => $file) {
            if ($file instanceof \Illuminate\Http\UploadedFile && $file->isValid()) {
                
                $maxNumber++;
                $name = $maxNumber . ".jpg";
                
                try {
                    $disk->putFileAs($directory, $file, $name);
                    $mensajesExitosos ++;
                } catch (\Exception $e) {
                    \Log::error("Error al subir imagen: " . $e->getMessage());
                    $mensajesErrores[] = "Error al subir el archivo: " . $file->getClientOriginalName();
                }
            } else {
                $mensajesErrores[] = "Error: El archivo no es válido o está vacío.";
            }
        }
        
        if ($mensajesExitosos > 0) {
            $mensaje = "Se han subido " . $mensajesExitosos . " archivo(s) exitosamente.";
        } else {
            $mensaje = "No se ha subido ningún archivo.";
        }

        return redirect()->route('subir')->with('msj', ['success' => $mensaje, 'errors' => $mensajesErrores]);
    }


    /**
     * Obtiene el número más alto de los archivos .jpg en el directorio de imágenes.
     *
     * @param \Illuminate\Contracts\Filesystem\Filesystem $disk
     * @param string $directory
     * @return int
     */
    /**
 * Obtiene el número más alto de los archivos .jpg en los directorios de imágenes.
 * Busca recursivamente en la carpeta 'images/' y sus subcarpetas.
 *
 * @param string $baseDirectory La carpeta base donde empezar a buscar (ej: 'images').
 * @return int
 */
private function getMaxImageNumber(string $baseDirectory): int
{
    // Usamos el disco 'public'
    $disk = Storage::disk('public'); 

    $filePaths = $disk->allFiles($baseDirectory); 

    $numbers = collect($filePaths)
        ->map(function($path) {
            $fileName = basename($path); 
            
            preg_match('/(\d+)\.jpg$/', $fileName, $matches);
            
            return isset($matches[1]) ? (int)$matches[1] : 0; 
        })
        ->filter()
        ->all();

    return max(array_merge([0], $numbers)) || 10000;
}
    
       

    public function eliminar(Request $request)
    {
        try {
            $file = $request->codigo;
            // Definiendo la ruta completa del archivo
            $path = public_path('images\\' . $file);
        
            // Verificando si el archivo existe
            if (File::exists($path)) {
                File::delete($path);
            }
        } catch (\Throwable $th) {
        }
    }
}