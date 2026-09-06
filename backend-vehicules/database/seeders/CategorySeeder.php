<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Économique', 'description' => 'Véhicules économiques pour les petits budgets'],
            ['name' => 'Standard', 'description' => 'Véhicules standards pour un usage quotidien'],
            ['name' => 'Premium', 'description' => 'Véhicules haut de gamme pour un confort optimal'],
            ['name' => 'SUV', 'description' => 'Véhicules utilitaires sportifs'],
            ['name' => 'Utilitaire', 'description' => 'Véhicules utilitaires pour le transport'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }
    }
}
