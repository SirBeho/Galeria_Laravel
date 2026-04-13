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
            // --- ENERO: Año Nuevo (Fresco y Limpio) ---
            ['key' => 'imagen_principal_code', 'value' => 'nuevo.png', 'month' => 1],
            ['key' => 'color_primario',         'value' => '#0EA5E9', 'month' => 1], // Sky 500 (Azul brillante)
            ['key' => 'color_secundario',       'value' => '#64748B', 'month' => 1], // Slate 500 (Gris elegante)
        
            // --- FEBRERO: San Valentín (Amor y Pasión) ---
            ['key' => 'imagen_principal_code', 'value' => 'san_valentin.png', 'month' => 2],
            ['key' => 'color_primario',         'value' => '#E11D48', 'month' => 2], // Rose 600 (Rojo vibrante)
            ['key' => 'color_secundario',       'value' => '#FB7185', 'month' => 2], // Rose 400 (Rosa suave para detalles)
        
            // --- MARZO: Normal (Corporativo y Neutro - El que más dura) ---
            ['key' => 'imagen_principal_code', 'value' => 'favicon.png', 'month' => 3],
            ['key' => 'color_primario',         'value' => '#1E293B', 'month' => 3], // Slate 800 (Azul oscuro pro)
            ['key' => 'color_secundario',       'value' => '#3B82F6', 'month' => 3], // Blue 500 (El color de acción por excelencia)
        
            // --- JUNIO: Verano (Calidez y Sol) ---
            ['key' => 'imagen_principal_code', 'value' => 'verano.png', 'month' => 6],
            ['key' => 'color_primario',         'value' => '#F59E0B', 'month' => 6], // Amber 500 (Naranja sol)
            ['key' => 'color_secundario',       'value' => '#D97706', 'month' => 6], // Amber 600 (Para contraste en labels)
        
            // --- OCTUBRE: Black Friday / Ofertas (Elegante y Agresivo) ---
            ['key' => 'imagen_principal_code', 'value' => 'halloween.png', 'month' => 10],
            ['key' => 'color_primario',         'value' => '#111827', 'month' => 10], // Gray 900 (Casi negro)
            ['key' => 'color_secundario',       'value' => '#F97316', 'month' => 10], // Orange 500 (Color clásico de "Oferta")
        
            // --- DICIEMBRE: Navidad (Tradicional) ---
            ['key' => 'imagen_principal_code', 'value' => 'navidad.png', 'month' => 12],
            ['key' => 'color_primario',         'value' => '#B91C1C', 'month' => 12], // Red 700 (Rojo Navidad)
            ['key' => 'color_secundario',       'value' => '#15803D', 'month' => 12], // Green 700 (Verde pino)
        ];

        // 2. Insertar los datos. Usamos firstOrCreate para evitar duplicados si ya existen
        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                [
                    'key'   => $setting['key'],
                    'month' => $setting['month']
                ], 
                [
                    'value' => $setting['value']
                ]
            );
        }

        $this->command->info('✅ Configuracion Creada".');
    }
}
