<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


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