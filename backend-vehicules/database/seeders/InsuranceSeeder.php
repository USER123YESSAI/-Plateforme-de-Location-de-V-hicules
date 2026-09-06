<?php

namespace Database\Seeders;

use App\Models\Insurance;
use Illuminate\Database\Seeder;

class InsuranceSeeder extends Seeder
{
    public function run(): void
    {
        $insurances = [
            [
                'name' => 'Basique (Tiers)',
                'description' => 'Couverture minimale obligatoire.',
                'coverage' => 'Responsabilité civile, défense et recours.',
                'daily_rate' => 5000.00,
            ],
            [
                'name' => 'Intermédiaire',
                'description' => 'Protection étendue contre les risques courants.',
                'coverage' => 'Tiers + Vol, Incendie, et bris de glace.',
                'daily_rate' => 10000.00,
            ],
            [
                'name' => 'Tous Risques',
                'description' => 'La protection maximale pour votre tranquillité.',
                'coverage' => 'Intermédiaire + Dommages tous accidents, Assistance 24/7.',
                'daily_rate' => 20000.00,
            ],
        ];

        foreach ($insurances as $insurance) {
            Insurance::create($insurance);
        }
    }
}