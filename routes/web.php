<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\SubscriptionController;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
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

    $allFilesHome = Cache::remember('gallery_home_files', 600, function () {
        return array_reverse(Storage::disk('gallery')->files());
    });

    $allFilesJuegos = Cache::remember('gallery_juegos_files', 600, function () {
        return array_reverse(Storage::disk('gallery')->files('juegos'));
    });

    // 2. Paginación Manual (Obtener el número de página de la URL)
    $page = Request::get('page', 1);
    $estado = (int) Request::get('ev', 0);
    $perPage = 100;
    if ($estado == 0) {
        $perPage = 99;
    }
   
    $offset = 0;
    $limit = $page * $perPage;

    // Cortamos el array para enviar solo 50
    $imgHome = array_slice($allFilesHome, $offset, $limit);
    $imgJuegos = array_slice($allFilesJuegos, 0, $offset + $perPage);


        return Inertia::render('Home', [
            'imgHome' => $imgHome,
            'imgJuegos' => $imgJuegos,
            'user' => auth()->user() ?? false,
            'nextPage' => count($allFilesHome) > $limit ? $page + 1 : null,
        ]);
})->name('home');

Route::post('/deploy-post-tasks', function (Request $request) {
    set_time_limit(300); // Evita cortes si vendor.zip es pesado

    $token = $request->bearerToken() ?? $request->header('X-Deploy-Token');
    if (!$token || !hash_equals((string) config('app.deploy_token', env('DEPLOY_CLEAN_TOKEN')), $token)) {
        abort(403, 'No autorizado');
    }

    $log = [];
    $basePath = base_path();

    // 1. Descomprimir vendor.zip si existe
    $zipPath = $basePath . '/vendor.zip';
    if (File::exists($zipPath)) {
        $zip = new \ZipArchive;
        if ($zip->open($zipPath) === true) {
            $zip->extractTo($basePath);
            $zip->close();
            File::delete($zipPath);
            $log[] = 'vendor.zip descomprimido y eliminado.';
        } else {
            return response()->json(['error' => 'No se pudo abrir vendor.zip'], 500);
        }
    }

    // 2. Crear enlace simbólico si no existe
    $link = $basePath . '/public_html/storage';
    if (!file_exists($link)) {
        Artisan::call('storage:link-html');
        $log[] = 'Storage link creado: ' . trim(Artisan::output());
    }

    // 3. Limpiar y optimizar caché
    Artisan::call('optimize:clear');
    Artisan::call('optimize');
    $log[] = 'Caché limpia y optimizada.';

    return response()->json(['status' => 'ok', 'tasks' => $log]);
});


Route::get('/pedido', [PedidoController::class, 'index'])->name('pedido.view');
Route::post('/notificacion', [PedidoController::class, 'notificacion_whatsapp'])->name('notificacion');

Route::post('/add', [PedidoController::class, 'add'])->name('pedido.add');
Route::post('/enviado', [PedidoController::class, 'sent'])->name('pedido.sent');
Route::post('/estado', [PedidoController::class, 'status'])->name('pedido.status');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::post('/push-subscribe', [SubscriptionController::class, 'store'])->name('push.subscribe');

    Route::get('/panel', function () {
        return Inertia::render('Panel', [
            'pedidos' => Pedido::all()->sortBy('id')->load('detalle'),
            'user' => auth()->user() ?? [],
            'vapidKey' => config('services.webpush.public_key')
        ]);
    })->name('panel');

    Route::get('/subir', [FileController::class, 'index'])->name('subir');
    Route::post('/eliminar', [FileController::class, 'eliminar'])->name('eliminar.imagen');
    Route::post('/subir', [FileController::class, 'uploadImages'])->name('subir.imagen');

    Route::post('/limpiar-cache', function () {
        try {
            Artisan::call('app:clean-cache');

            return back()->with('msj' ,[
                'success'=> 'La caché de la configuración del diseño ha sido actualizada.',
                'title' => 'Cache Limpiada'
            ]);
            
        
        } catch (\Exception $e) {
            // Retorna JSON para indicar error
            return response()->json([
                'status' => 'error',
                'message' => 'Error durante la limpieza: ' . $e->getMessage(),
            ], 500);
        }
    })->name('clean.cache');
    
    

});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
require __DIR__.'/auth.php';
