<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
public function run(): void
{
   /** 
    * // Créer l'ADMIN
    User::factory()->create([
        'name' => 'Admin de la Plateforme',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin', // On ajoute un champ rôle
    ]);

    // Créer un USER classique
    User::factory()->create([
        'name' => 'Client Test',
        'email' => 'user@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
    ]);
     */

    // Appeler les autres seeders
    $this->call([
        CategorySeeder::class,
        UserSeeder::class,
        VehicleSeeder::class,
        InsuranceSeeder::class,
        RentalSeeder::class,
    ]);
}
}