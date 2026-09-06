<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer l'ADMIN
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin de la Plateforme',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Créer un USER classique
        User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Client Test',
                'password' => Hash::make('client123'),
                'role' => 'client',
            ]
        );
    }
}
