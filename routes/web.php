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

Route::get('/login', [AuthenticatedSessionController::class, 'create']);
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::get('/', function () {

        $folderPath = dirname(__DIR__) . '/public/images';
        $fileNames = scandir($folderPath);

        $filteredFileNames = array_filter($fileNames, function($fileName) {
            return $fileName !== '.' && $fileName !== '..';
        });

      

        return Inertia::render('Home', [
            'nombres' => array_reverse($filteredFileNames),
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


Route::post('/add', [PedidoController::class, 'add'])->name('pedido.add');
Route::post('/enviado', [PedidoController::class, 'sent'])->name('pedido.sent');
Route::post('/estado', [PedidoController::class, 'status'])->name('pedido.status');


Route::middleware(['auth', 'verified'])->group(function () {


    Route::get('/panel', function () {
        return Inertia::render('Panel',[
            'pedidos'=> Pedido::all()->sortBy('id')->load('detalle'),
            
            'user' => auth()->user() ?? [],
        ]);
    })->name('panel');

});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
->name('logout');
require __DIR__ . '/auth.php';
