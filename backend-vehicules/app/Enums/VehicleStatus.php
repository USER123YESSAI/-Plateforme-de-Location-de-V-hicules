<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case AVAILABLE = 'available';
    case RENTED = 'rented';
    case MAINTENANCE = 'maintenance';
    case UNAVAILABLE = 'unavailable';

    public function label(): string
    {
        return match ($this) {
            self::AVAILABLE => 'Disponible',
            self::RENTED => 'En location',
            self::MAINTENANCE => 'En maintenance',
            self::UNAVAILABLE => 'Indisponible',
        };
    }
}
