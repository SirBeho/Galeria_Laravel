<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'imagen_principal_code',   'value' => 'navidad.png'],
            ['key' => 'color_primario',     'value' => '#B91C1C'], // Rojo Navidad
            ['key' => 'color_secundario',   'value' => '#38a169'], // Verde Navidad
        ];

        // 2. Insertar los datos. Usamos firstOrCreate para evitar duplicados si ya existen
        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
