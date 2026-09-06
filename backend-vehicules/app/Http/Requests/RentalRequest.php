<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Services\VehicleService; 

class RentalRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'pickup_location' => 'required|string|max:255',
            'return_location' => 'required|string|max:255',
            'insurance_id' => 'nullable|exists:insurances,id',
            'notes' => 'nullable|string|max:500'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $service = new VehicleService();
            $availability = $service->checkAvailability(
                $this->vehicle_id,
                $this->start_date,
                $this->end_date
            );
            
            if (!$availability['available']) {
                $validator->errors()->add('vehicle_id', 'Ce véhicule n\'est pas disponible pour cette période');
            }
        });
    }
}