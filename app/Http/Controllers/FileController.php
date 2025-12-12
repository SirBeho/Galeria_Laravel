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
use Illuminate\Support\Facades\Log; // Importar para logging profesional


class FileController extends Controller
{
         
    public function index(Request $request)
    {
        return Inertia::render('Subir',[
            'pedidos'=> Pedido::all()->sortBy('id')->load('detalle'),
            'user' => auth()->user() ?? []
        ]);
        
    }

    public function uploadImages(Request $request)
    {
        $mensajesExitosos = 0;
        $mensajesErrores = [];

        $disk = Storage::disk('gallery');
        $fileNames = $disk->files();
        
        $numbers = array_map(function($file) {
            if (preg_match('/(\d+)\.jpg$/', $file, $matches)) {
                return (int)$matches[1];
            }
            return 0;
        }, $fileNames);
           
        // Obtener el número más alto
        $maxNumber = max($numbers);
        
        foreach ($request->all() as $index => $file) {
            if (is_a($file, \Illuminate\Http\UploadedFile::class) && $file->isValid()) {
                $maxNumber++;
                $name = $maxNumber . ".jpg";
                
                try {
                    $disk->putFileAs('/', $file, $name);
                    
                    $mensajesExitosos ++;
                } catch (\Exception $e) {
                    $mensajesErrores[] = "Error al subir el archivo: " . $file->getClientOriginalName() . " - " . $e->getMessage();
                    Log::error("Error al subir imagen: " . $e->getMessage());
                }
            } else {
                $mensajesErrores[] = "Error: El archivo no es válido o no es un archivo subido.";
            }
        }
        
        if ($mensajesExitosos > 0) {
            $mensaje = "Se han subido " . $mensajesExitosos . " archivo(s) exitosamente.";
        } else {
            $mensaje = "No se ha subido ningún archivo.";
        }


        return redirect()->back()->with('msj', ['success' => $mensaje, 'errors' => $mensajesErrores]);

    }
    
       
    public function eliminar(Request $request)
    {
        $request->validate([
            'codigos' => 'required|array',
            'codigos.*' => 'string', 
        ]);
        

        $files = $request->input('codigos'); 
        $disk = Storage::disk('gallery'); // 🟢 Usar el disco
        $deletionSuccessful = 0;

        try {
            foreach ($files as $fileName) {
                // 3. Verificar y Eliminar
                
                if ($disk->exists($fileName)) { 
                
                    // 2. Intentar Eliminar (Si existe, debería funcionar)
                    if ($disk->delete($fileName)) { 
                        //Log::info("Archivo eliminado: " . $fileName);
                        $deletionSuccessful++;
                    } else {
                        // Fallo de eliminación por permisos, etc.
                        Log::error("Fallo grave al eliminar archivo existente: " . $fileName);
                    }
                    
                } 
                
            }

            return redirect()->back()->with('msj', [
                'success' => true,
                'message' => $deletionSuccessful . ' archivos eliminados correctamente.',
                'errors' => []
            ]);
          
        } catch (\Throwable $th) {
            // 5. Manejo de Errores
            Log::error('Error al eliminar archivos: ' . $th->getMessage());
            
            return redirect()->back()->with('msj', [
                'message' => 'Error al eliminar archivos: ' . $th->getMessage(),
                'errors' => ['error']
            ]);
        }
    }
}
    
