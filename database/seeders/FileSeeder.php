<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class FileSeeder extends Seeder
{
    public function run(): void
    {
        // Define el disco de la galería que usa tu aplicación
        $disk = Storage::disk('gallery'); 
        
        // 2. Crea contenido falso para los archivos
        $dummyContent = 'This is a test image file content.';
        
        // Si necesitas un archivo más realista, puedes usar un archivo binario pequeño:
        $disk->put('test_1.png', file_get_contents(public_path('navidad.png')));
        $disk->put('test_2.png', file_get_contents(public_path('navidad.png')));
        $disk->put('test_3.png', file_get_contents(public_path('navidad.png')));

        //$this->command->info('✅ Archivos de prueba creados en el disco "gallery".');
        $this->command->info('✅ Archivos Creados".');
    }
}