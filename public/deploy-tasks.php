<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Artisan;

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$projectRoot = dirname(__DIR__);
$envPath = $projectRoot . '/.env';

// 1. Leer DEPLOY_CLEAN_TOKEN desde .env sin depender de vendor/
$expectedToken = '';
if (is_file($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed !== '' && !str_starts_with($trimmed, '#') && str_starts_with($trimmed, 'DEPLOY_CLEAN_TOKEN=')) {
            $expectedToken = trim(substr($trimmed, strlen('DEPLOY_CLEAN_TOKEN=')), " \t\n\r\0\x0B\"'");
            break;
        }
    }
}

$providedToken = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';
if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Token inválido o no configurado en .env']);
    exit;
}

try {
    $steps = [];

    // 2. Eliminar cachés previas de bootstrap antes de arrancar Laravel
    $cacheFiles = glob($projectRoot . '/bootstrap/cache/*.php') ?: [];
    foreach ($cacheFiles as $file) {
        @unlink($file);
    }
    $steps[] = 'bootstrap/cache limpiado (' . count($cacheFiles) . ' archivos)';

    // 3. Descomprimir vendor.zip si fue subido en este despliegue
    $zipPath = $projectRoot . '/vendor.zip';
    if (is_file($zipPath)) {
        $zip = new ZipArchive();
        if ($zip->open($zipPath) !== true) {
            throw new RuntimeException('No se pudo abrir vendor.zip');
        }
        $zip->extractTo($projectRoot);
        $zip->close();
        @unlink($zipPath);
        $steps[] = 'vendor.zip descomprimido y eliminado';
    }

    // 4. Garantizar estructura mínima de carpetas en storage/
    $requiredDirs = [
        $projectRoot . '/storage/app/public',
        $projectRoot . '/storage/framework/cache/data',
        $projectRoot . '/storage/framework/sessions',
        $projectRoot . '/storage/framework/views',
        $projectRoot . '/storage/logs',
    ];
    foreach ($requiredDirs as $dir) {
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException("No se pudo crear el directorio: {$dir}");
        }
    }

    // 5. Inicializar Laravel
    require $projectRoot . '/vendor/autoload.php';
    $app = require_once $projectRoot . '/bootstrap/app.php';
    $kernel = $app->make(Kernel::class);
    $kernel->bootstrap();

    // 6. Ejecutar comandos Artisan en orden: limpiar -> enlazar -> optimizar
    $commands = [
        'app:clean-cache',
        'storage:link-html',
        'optimize',
    ];

    foreach ($commands as $command) {
        Artisan::call($command);
        $output = trim(Artisan::output());
        $steps[] = $output !== '' ? "{$command}: {$output}" : "{$command}: OK";
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'ok',
        'steps' => $steps,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => basename($e->getFile()) . ':' . $e->getLine(),
    ], JSON_UNESCAPED_UNICODE);
}