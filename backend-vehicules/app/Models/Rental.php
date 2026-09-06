<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rental extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'pickup_location',
        'return_location',
        'insurance_id',
        'notes',
        'status',
        'daily_rate',     
        'insurance_rate',  
        'total_days',     
        'subtotal',        
        'insurance_total',
        'total_amount'     
    ];

    public function user() 
    { 
        return $this->belongsTo(User::class); 
    }

    public function vehicle() 
    { 
        return $this->belongsTo(Vehicle::class); 
    }

    public function insurance() 
    { 
        return $this->belongsTo(Insurance::class); 
    }

    public function payment() 
    { 
        return $this->hasOne(Payment::class); 
    }
}
