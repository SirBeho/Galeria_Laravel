<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\SubscriptionController;
use App\Models\Pedido;
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
            Cache::forget('app_settings');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            Cache::forget('gallery_home_files');
            Cache::forget('gallery_juegos_files');

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
