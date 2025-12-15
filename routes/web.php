<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ChirpController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\TipoSolicitudController;
use App\Models\Empresa;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//5NG7RN5Q761CQ2Y5CCWKSXSJ
Route::get('/login', [AuthenticatedSessionController::class, 'create']);
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::get('/', function () {

        $imagePaths = Storage::disk('public')->files('images'); 
        $imageUrls = collect($imagePaths)->map(function ($path) {
            return Storage::disk('public')->url($path);
        })->reverse()->values()->all();

        return Inertia::render('Home', [
            'nombres' => array_reverse($imageUrls),
            'user' => auth()->user() ?? false,
        ]);
})->name('home');

Route::get('/pedido', function (Request $request) {

   
     $p_value = $request->input('p');
     $key_value = $request->input('key');

     $pedido = Pedido::where('numero_pedido', $p_value)->where('key', $key_value)->first()->load('detalle');

     if (!$pedido) {
         return Inertia::render('AccessDenied');
     }
     
     return Inertia::render('Pedido', [
        'user' => auth()->user() ?? [],
        'pedido' => $pedido,
     ]);
  
})->name('pedido.view');


Route::post('/notificacion', [PedidoController::class, 'notificacion_whatsapp'])->name('notificacion');

Route::post('/add', [PedidoController::class, 'add'])->name('pedido.add');
Route::post('/enviado', [PedidoController::class, 'sent'])->name('pedido.sent');
Route::post('/estado', [PedidoController::class, 'status'])->name('pedido.status');

Route::get('/limpiar-deploy-secreto/{token}', function ($token) {
    try {

    // 1. Verifica el Token de Seguridad
    // Obtén el token de tu .env, que debe ser un string largo y único
    if ($token !== env('DEPLOY_CLEAN_TOKEN')) {
        abort(403, 'Acceso Denegado. Token de limpieza inválido.');
    }

    $zipPath = base_path('vendor.zip');

    if (File::exists($zipPath)) {

        $zip = new \ZipArchive;

        if ($zip->open($zipPath) === TRUE) {
        
            // Extraer todo el contenido al directorio base (base_path())
            $zip->extractTo(base_path());
            $zip->close();
            
            // Opcional: Eliminar el ZIP para limpiar el servidor
            File::delete($zipPath);
            
            Log::info("Vendor descomprimido usando ZipArchive.");
            
        } else {
            // Falló al abrir el archivo ZIP (quizás corrupto o no es un ZIP)
            throw new \Exception('No se pudo abrir el archivo vendor.zip para descompresión.');
        }
        // Ejecuta el comando 'unzip' para extraer en el directorio raíz
        
    }else{
        log::info("El archivo vendor.zip no existe en la ruta esperada.");
    }
    // 2. Ejecuta los Comandos de Limpieza

    Artisan::call('cache:clear');
    Artisan::call('config:clear'); 
    Artisan::call('route:clear');
    Artisan::call('view:clear');
   
        Artisan::call('optimize:clear');
        
        // Retorna JSON para indicar éxito
        return response()->json([
            'status' => 'success',
            'message' => 'Despliegue completado, vendor descomprimido y caché limpiada.',
        ], 200);

    } catch (\Exception $e) {
        // Retorna JSON para indicar error
        return response()->json([
            'status' => 'error',
            'message' => 'Error durante la limpieza: ' . $e->getMessage(),
        ], 500);
    }
})->name('deploy.clean');


Route::middleware(['auth', 'verified'])->group(function () {


    Route::get('/panel', function () {
        return Inertia::render('Panel',[
            'pedidos'=> Pedido::all()->sortBy('id')->load('detalle'),
            
            'user' => auth()->user() ?? [],
        ]);
    })->name('panel');

    Route::get('/subir', [FileController::class, 'index'])->name('subir');
    Route::post('/eliminar', [FileController::class, 'eliminar'])->name('eliminar.imagen');
    Route::post('/subir', [FileController::class, 'uploadImages'])->name('subir.imagen');

    

});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
->name('logout');
require __DIR__ . '/auth.php';
