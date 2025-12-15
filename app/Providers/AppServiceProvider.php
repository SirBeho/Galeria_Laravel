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

        $settings = Cache::rememberForever('app_settings', function () {
            return Setting::all()->pluck('value', 'key')->toArray();
        });
    
        config(['settings' => $settings]);    


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
