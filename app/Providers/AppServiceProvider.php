<?php

namespace App\Providers;

use App\Models\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
        {
        $this -> app -> bind('path.public', function()
            {
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


        Validator::extend('unique_name', function ($attribute, $value, $parameters, $validator) {
            $nombres = $validator->getData()['nombre'];
            $count = array_count_values($nombres)[$value] ?? 0;
            
        if ($count > 1) {
            return false; 
        }
        
            return !File::where('nombre', $value)->where('user_id', auth()->user()->id)->exists();
        });
    }
}
