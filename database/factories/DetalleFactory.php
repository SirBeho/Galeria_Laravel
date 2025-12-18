<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Detalle>
 */
class DetalleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $fileNames = Storage::disk('gallery')->files();

        $codigoFallback = ['50000.png']; 

        $elementosDisponibles = empty($fileNames) ? $codigoFallback : $fileNames;

        return [
            'codigo' => $this->faker->randomElement($elementosDisponibles),
            'cantidad' => $this->faker->numberBetween(1, 5),
            'comentario' => $this->faker->sentence(3),
        ];
    }
}
