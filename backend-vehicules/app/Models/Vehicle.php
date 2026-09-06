<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Rental;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'brand', 
        'model', 
        'year', 
        'license_plate', 
        'category_id', 
        'daily_rate', 
        'fuel_type', 
        'transmission', 
        'seats', 
        'mileage', 
        'status', 
        'image'
    ];

    public function category()
    { 
        return $this->belongsTo(Category::class); 
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class)->orderBy('start_date', 'desc');
    }
}
