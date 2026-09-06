<!DOCTYPE html>
<html>
<head>
    <title>Facture #{{ $rental->id }}</title>
    <style>
        body { font-family: sans-serif; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .details { margin-top: 30px; }
        .total { font-size: 20px; font-weight: bold; color: #2c3e50; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURE DE LOCATION</h1>
        <p>Référence : #{{ $rental->id }} | Date : {{ $date }}</p>
    </div>

    <div class="details">
        <p><strong>Client :</strong> {{ $rental->user->name }}</p>
        <p><strong>Véhicule :</strong> {{ $rental->vehicle->brand }} {{ $rental->vehicle->model }} ({{ $rental->vehicle->license_plate }})</p>
        <p><strong>Période :</strong> Du {{ $rental->start_date }} au {{ $rental->end_date }} ({{ $rental->total_days }} jours)</p>
    </div>

    <table width="100%" style="margin-top: 50px; border-collapse: collapse;">
        <tr style="background: #eee;">
            <th align="left">Description</th>
            <th align="right">Montant</th>
        </tr>
        <tr>
            <td>Location journalière ({{ $rental->daily_rate }} FCFA x {{ $rental->total_days }})</td>
            <td align="right">{{ number_format($rental->subtotal, 0, ',', ' ') }} FCFA</td>
        </tr>
        @if($rental->insurance_total > 0)
        <tr>
            <td>Assurance ({{ $rental->insurance->name }})</td>
            <td align="right">{{ number_format($rental->insurance_total, 0, ',', ' ') }} FCFA</td>
        </tr>
        @endif
        <tr class="total">
            <td style="padding-top: 20px;">TOTAL À PAYER</td>
            <td align="right" style="padding-top: 20px;">{{ number_format($rental->total_amount, 0, ',', ' ') }} FCFA</td>
        </tr>
    </table>
</body>
</html>