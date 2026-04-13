<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

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
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        \Log::info("Iniciando limpieza de caché programada...");
    
        \Cache::forget('app_settings');
        \Cache::forget('gallery_home_files');
        \Cache::forget('gallery_juegos_files');
        
        \Artisan::call('config:clear');
        \Artisan::call('view:clear');

        $this->info('Caché del sistema actualizada correctamente.');
        \Log::info("Caché del sistema actualizada correctamente. Fecha: " . now());
    }
}
