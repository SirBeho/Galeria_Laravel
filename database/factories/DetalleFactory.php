<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
           'codigo' => $this->faker->regexify('[A-Z0-9]{8}'), 
            'cantidad' => $this->faker->numberBetween(1, 5),
            'comentario' => $this->faker->sentence(3),
        ];
    }
}
