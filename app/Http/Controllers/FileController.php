<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Importar para logging profesional
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class FileController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Subir', [
            'pedidos' => Pedido::all()->sortBy('id')->load('detalle'),
            'user' => auth()->user() ?? [],
        ]);

    }

    public function uploadImages(Request $request): RedirectResponse
    {

        $disk = Storage::disk('public');
        $directory = 'images';
        
        $mensajesExitosos = 0;
        $mensajesErrores = [];

    
        $maxNumber = $maxNumber = $this->getMaxImageNumber('images');
        
        foreach ($request->all() as $index => $file) {
            if ($file instanceof \Illuminate\Http\UploadedFile && $file->isValid()) {
                
                $maxNumber++;
                $name = $maxNumber.'.jpg';

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
            $mensaje = 'Se han subido '.$mensajesExitosos.' archivo(s) exitosamente.';
        } else {
            $mensaje = 'No se ha subido ningún archivo.';
        }

        return redirect()->back()->with('msj', ['success' => $mensaje, 'errors' => $mensajesErrores]);

    }

    public function eliminar(Request $request): RedirectResponse
    {
        $request->validate([
            'codigos' => 'required|array',
            'codigos.*' => 'string',
        ]);

        $files = $request->input('codigos');
        /** @var array<string> $files */
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
}
