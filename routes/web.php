<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PedidoController;
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
//5NG7RN5Q761CQ2Y5CCWKSXSJ
Route::get('/login', [AuthenticatedSessionController::class, 'create']);
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::get('/', function () {

    $folderPath = dirname(__DIR__).'/public/images';
    $fileNames = scandir($folderPath);

    $filteredFileNameshome = array_filter($fileNames, function ($fileName) {
        return $fileName !== '.' && $fileName !== '..' && $fileName !== 'juegos';
    });

    $folderPath2 = dirname(__DIR__).'/public/images/juegos';
    $fileNames2 = scandir($folderPath2);

    $filteredFileNamesJuegos = array_filter($fileNames2, function ($fileName) {
        return $fileName !== '.' && $fileName !== '..';
    });

    $filteredFileNamesJuegos = array_map(function ($fileName) {
        // Retorna la ruta completa y sobrescribe el valor
        return 'juegos/'.$fileName;
    }, $filteredFileNamesJuegos);

    return Inertia::render('Home', [
        'imgHome' => array_reverse($filteredFileNameshome),
        'imgJuegos' => array_reverse($filteredFileNamesJuegos),
        'user' => auth()->user() ?? false,
    ]);
})->name('home');

Route::get('/pedido', [PedidoController::class, 'index'])->name('pedido.view');
Route::post('/notificacion', [PedidoController::class, 'notificacion_whatsapp'])->name('notificacion');

Route::post('/add', [PedidoController::class, 'add'])->name('pedido.add');
Route::post('/enviado', [PedidoController::class, 'sent'])->name('pedido.sent');
Route::post('/estado', [PedidoController::class, 'status'])->name('pedido.status');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/panel', function () {
        return Inertia::render('Panel', [
            'pedidos' => Pedido::all()->sortBy('id')->load('detalle'),

            'user' => auth()->user() ?? [],
        ]);
    })->name('panel');

    Route::get('/subir', [FileController::class, 'index'])->name('subir');
    Route::post('/eliminar', [FileController::class, 'eliminar'])->name('eliminar.imagen');
    Route::post('/subir', [FileController::class, 'uploadImages'])->name('subir.imagen');

});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
require __DIR__.'/auth.php';
