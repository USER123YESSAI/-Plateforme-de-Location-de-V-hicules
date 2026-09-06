// RentalService
public function calculatePrice($vehicleId, $startDate, $endDate, $insuranceId = null)
{
    $vehicle = Vehicle::findOrFail($vehicleId);
    
    $start = Carbon::parse($startDate);
    $end = Carbon::parse($endDate);
    $totalDays = $end->diffInDays($start) + 1;
    
    $dailyRate = $vehicle->daily_rate;
    $subtotal = $dailyRate * $totalDays;
    
    $insuranceTotal = 0;
    $insuranceRate = 0;
    
    if ($insuranceId) {
        $insurance = Insurance::findOrFail($insuranceId);
        $insuranceRate = $insurance->daily_rate;
        $insuranceTotal = $insuranceRate * $totalDays;
    }
    
    return [
        'total_days' => $totalDays,
        'daily_rate' => $dailyRate,
        'subtotal' => $subtotal,
        'insurance_rate' => $insuranceRate,
        'insurance_total' => $insuranceTotal,
        'total_amount' => $subtotal + $insuranceTotal
    ];
}