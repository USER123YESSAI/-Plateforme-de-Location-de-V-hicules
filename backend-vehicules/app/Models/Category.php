<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    // Relation : Une catégorie a plusieurs véhicules
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
}