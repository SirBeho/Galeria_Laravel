<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CleanCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpia la caché mensual de configuraciones, galerías y vistas';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        Log::info('Iniciando limpieza de caché programada...');

        Cache::forget('app_settings');
        Cache::forget('gallery_home_files');
        Cache::forget('gallery_juegos_files');

        Artisan::call('config:clear');
        Artisan::call('view:clear');

        $this->info('Caché del sistema actualizada correctamente.');
        Log::info('Caché del sistema actualizada correctamente. Fecha: ' . now());

        return Command::SUCCESS;
    }
}