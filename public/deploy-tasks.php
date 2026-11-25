<?php

declare(strict_types=1);

$projectRoot = dirname(__DIR__);
$envPath = $projectRoot . '/.env';
$expectedToken = '';

if (is_file($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $trimmed = trim($line);
        if ($trimmed !== '' && !str_starts_with($trimmed, '#') && str_starts_with($trimmed, 'DEPLOY_CLEAN_TOKEN=')) {
            $expectedToken = trim(substr($line, strlen('DEPLOY_CLEAN_TOKEN=')), " \t\n\r\0\x0B\"'");
            break;
        }
    }
}

$providedToken = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';
if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode([
        'status' => 'error',
        'message' => 'Falta vendor o token inválido',
    ], JSON_UNESCAPED_UNICODE));
}

try {
    foreach (glob($projectRoot . '/bootstrap/cache/*.php') ?: [] as $file) {
        @unlink($file);
    }

    $zipPath = $projectRoot . '/vendor.zip';
    if (!is_file($zipPath)) {
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        exit(json_encode([
            'status' => 'error',
            'message' => 'Falta vendor y no se encontró vendor.zip',
        ], JSON_UNESCAPED_UNICODE));
    }

    $zip = new ZipArchive();
    if ($zip->open($zipPath) !== true) {
        throw new RuntimeException('No se pudo abrir vendor.zip');
    }
    $zip->extractTo($projectRoot);
    $zip->close();
    @unlink($zipPath);

    clearstatcache(true, $projectRoot . '/vendor/autoload.php');

    // Si fue llamado directamente y no desde public/index.php, responde y termina
    if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
        header('Content-Type: application/json; charset=utf-8');
        exit(json_encode(['status' => 'ok', 'message' => 'vendor.zip descomprimido'], JSON_UNESCAPED_UNICODE));
    }
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE));
}