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

        $fileNames =Storage::disk('gallery')->files();

        return [
            //tomar codigo de la lista de archivos que estan $fileNames
            'codigo' => $this->faker->randomElement($fileNames),
            'cantidad' => $this->faker->numberBetween(1, 5),
            'comentario' => $this->faker->sentence(3),
        ];
    }
}
