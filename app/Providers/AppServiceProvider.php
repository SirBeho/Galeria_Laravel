<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('path.public', function () {
            return base_path('public_html');
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! $this->app->runningInConsole() && Schema::hasTable('settings')) {    
                    
            $settingsArray = Cache::rememberForever('app_settings', function () {
            return Setting::orderBy('month', 'asc')->get()->toArray();
        });

       
        // Convertimos el array a Colección para poder usar groupBy()
        $settings = collect($settingsArray);

    

            $currentMonth = now()->month;
            $appliedSettings = [];

            $grouped = $settings->groupBy('key');
          


            foreach ($grouped as $key => $options) {

             
                // Buscamos el mejor match:
                // Filtramos los que sean menores o iguales al mes actual y tomamos el último (el más cercano)
                $bestMatch = $options->where('month', '<=', $currentMonth)->last();
               
                // Si no hay ninguno (ej: estamos en el mes 2 y solo hay config para el mes 6),
                // tomamos el primero disponible como fallback absoluto.
                if (!$bestMatch) {
                   
                    $bestMatch = $options->first();
                }
    
                $appliedSettings[$key] = $bestMatch['value'];
            }
        
            // Usar Config::set() en lugar de la función helper config() es más robusto en Service Providers
            Config::set('settings', $appliedSettings); 
        }

    }
}
