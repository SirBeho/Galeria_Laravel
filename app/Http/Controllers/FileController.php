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

    
        $mensajesExitosos = 0;
        $mensajesErrores = [];
         
        $fileNames = scandir('../public/images');
        $numbers = array_map(function($file) {
            preg_match('/(\d+)\.jpg$/', $file, $matches);
            return isset($matches[1]) ? (int)$matches[1] : 0;
        }, $fileNames);
           
        // Obtener el número más alto
        $maxNumber = max($numbers);
        
        foreach ($request->all() as $index => $file) {
            if ($file->isValid()) {
                $maxNumber++;
                $name = $maxNumber . ".jpg";
                
                try {
                    $file->move(public_path('images'), $name);
                    $mensajesExitosos ++;
                } catch (\Exception $e) {
                    $mensajesErrores[] = "Error al subir el archivo: " . $file->getClientOriginalName();
                }
            } else {
                $mensajesErrores[] = "Error: El archivo no es válido.";
            }
        }
        
        if ($mensajesExitosos > 0) {
            $mensaje = "Se han subido " . $mensajesExitosos . " archivo(s) exitosamente.";
        } else {
            $mensaje = "No se ha subido ningún archivo.";
        }


       
        return redirect()->route('subir')->with('msj', ['success' => $mensaje, 'errors' => $mensajesErrores]);

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