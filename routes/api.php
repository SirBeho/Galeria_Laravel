<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

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

Route::post('/deploy-post-tasks', function (\Illuminate\Http\Request $request) {
    $expectedToken = (string) env('DEPLOY_CLEAN_TOKEN', '');
    $providedToken = (string) $request->header('X-Deploy-Token', '');

    if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
        return response()->json([
            'status' => 'error',
            'message' => 'Token invalido o DEPLOY_CLEAN_TOKEN no configurado.',
        ], 403);
    }

    try {
        @set_time_limit(300);
        $steps = [];

        // 1. Descomprimir vendor.zip si existe en la raíz del proyecto
        $zipPath = base_path('vendor.zip');
        if (is_file($zipPath)) {
            $zip = new \ZipArchive();
            if ($zip->open($zipPath) !== true) {
                throw new \RuntimeException('No se pudo abrir vendor.zip');
            }
            $zip->extractTo(base_path());
            $zip->close();
            @unlink($zipPath);
            $steps[] = 'vendor.zip descomprimido y eliminado';
        }

        // 2. Garantizar que existan las carpetas base de storage/ (Git las ignora si están vacías)
        $requiredDirs = [
            storage_path('app/public'),
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('logs'),
        ];
        
        foreach ($requiredDirs as $dir) {
            if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
                throw new \RuntimeException("No se pudo crear el directorio: {$dir}");
            }
        }

        $steps[] = 'Directorios de storage verificados';

        // 3. Ejecutar limpieza de caché y enlaces simbólicos
        foreach (['app:clean-cache', 'storage:link-html', 'optimize:clear'] as $command) {
            Artisan::call($command);
            $output = trim(Artisan::output());
            $steps[] = $output !== '' ? "{$command}: {$output}" : "{$command}: OK";
        }

        return response()->json([
            'status' => 'ok',
            'steps' => $steps,
        ], 200)->header('X-LiteSpeed-Purge', '*');
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'file' => basename($e->getFile()) . ':' . $e->getLine(),
        ], 500);
    }
})->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);