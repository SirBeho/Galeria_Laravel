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
            $settings = Cache::rememberForever('app_settings', function () {
                // Ahora esto solo se ejecuta si la DB está lista y es una petición web.
                return Setting::all()->pluck('value', 'key')->toArray();
            });
        
            // Usar Config::set() en lugar de la función helper config() es más robusto en Service Providers
            Config::set('settings', $settings); 
        }

    }
}
