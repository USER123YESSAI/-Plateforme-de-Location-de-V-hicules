<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture & Bon de Prise en Charge #{{ $rental->id }} — Toumaï Drive</title>
    <style>
        @page {
            margin: 25px 30px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            font-size: 11px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 12px;
        }
        .logo-img {
            max-height: 60px;
            max-width: 180px;
        }
        .company-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0 0 4px 0;
            letter-spacing: 0.5px;
        }
        .company-sub {
            color: #64748b;
            font-size: 10px;
            margin: 0;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h1 {
            font-size: 18px;
            color: #0f172a;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            font-size: 10px;
            font-weight: bold;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .badge-paid {
            background-color: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }
        .badge-pending {
            background-color: #fef9c3;
            color: #854d0e;
            border: 1px solid #fef08a;
        }

        /* Colonnes 2 blocs */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            vertical-align: top;
        }
        .info-card h3 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #1e3a8a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-card p {
            margin: 3px 0;
            font-size: 10.5px;
        }

        /* SECTION CLEF: PRISE EN CHARGE DU VÉHICULE */
        .pickup-section {
            background-color: #eff6ff;
            border: 1.5px solid #3b82f6;
            border-radius: 6px;
            padding: 12px 14px;
            margin-bottom: 18px;
        }
        .pickup-header {
            font-size: 13px;
            font-weight: bold;
            color: #1d4ed8;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .pickup-table {
            width: 100%;
            border-collapse: collapse;
        }
        .pickup-box {
            background-color: #ffffff;
            border: 1px solid #bfdbfe;
            border-radius: 5px;
            padding: 8px 10px;
            vertical-align: top;
            width: 48%;
        }
        .pickup-label {
            font-size: 9.5px;
            font-weight: bold;
            color: #2563eb;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .pickup-val {
            font-size: 11px;
            font-weight: bold;
            color: #0f172a;
            margin: 0;
        }
        .pickup-sub {
            font-size: 9.5px;
            color: #64748b;
            margin-top: 2px;
        }

        /* INSTRUCTIONS & CHECKLIST */
        .checklist-box {
            background-color: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 18px;
        }
        .checklist-title {
            font-size: 11px;
            font-weight: bold;
            color: #92400e;
            margin: 0 0 6px 0;
            text-transform: uppercase;
        }
        .checklist-items {
            width: 100%;
            border-collapse: collapse;
        }
        .checklist-items td {
            font-size: 10px;
            color: #78350f;
            padding: 2px 0;
            vertical-align: top;
        }

        /* TABLEAU FINANCIER */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .items-table th {
            background-color: #1e3a8a;
            color: #ffffff;
            padding: 7px 10px;
            font-size: 10.5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .items-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10.5px;
        }
        .items-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .total-row td {
            font-weight: bold;
            font-size: 12px;
            color: #0f172a;
            border-top: 2px solid #1e3a8a;
            padding-top: 10px;
        }
        .total-amount {
            color: #1e3a8a;
            font-size: 14px;
        }

        /* FOOTER */
        .footer-note {
            margin-top: 15px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 10px;
            text-align: center;
            font-size: 9.5px;
            color: #64748b;
        }
        .footer-contacts {
            font-weight: bold;
            color: #1e3a8a;
        }
    </style>
</head>
<body>

    <!-- EN-TÊTE OFFICIEL -->
    <table class="header-table">
        <tr>
            <td width="55%" style="vertical-align: middle;">
                @if(!empty($logo))
                    <img src="{{ $logo }}" class="logo-img" alt="Toumaï Drive"><br>
                @endif
                <div class="company-title">TOUMAÏ DRIVE</div>
                <p class="company-sub">
                    Plateforme Moderne de Location & Mobilité de Véhicules<br>
                    N'Djamena, Tchad &bull; Tél/WhatsApp : +235 66 00 00 00 &bull; contact@toumaidrive.com
                </p>
            </td>
            <td width="45%" class="invoice-title" style="vertical-align: middle;">
                <h1>CONFIRMATION & FACTURE</h1>
                <p style="margin: 2px 0; font-size: 11px;"><strong>Réf. Réservation :</strong> #{{ str_pad($rental->id, 5, '0', STR_PAD_LEFT) }}</p>
                <p style="margin: 2px 0; font-size: 10px; color: #64748b;"><strong>Date d'émission :</strong> {{ $date }}</p>
                <div style="margin-top: 6px;">
                    @if($rental->payment && $rental->payment->status === 'completed')
                        <span class="badge badge-paid">&bull; RÉSERVÉ & PAYÉ</span>
                    @elseif($rental->status === 'confirmed')
                        <span class="badge badge-paid">&bull; RÉSERVATION CONFIRMÉE</span>
                    @else
                        <span class="badge badge-pending">&bull; EN ATTENTE DE CONFIRMATION</span>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <!-- DOUBLE COLONNE : CLIENT & VÉHICULE -->
    <table class="info-table">
        <tr>
            <!-- INFORMATIONS CONDUCTEUR -->
            <td width="48%" class="info-card">
                <h3>👤 Conducteur Principal</h3>
                <p><strong>Nom & Prénom :</strong> {{ $rental->user->name }}</p>
                <p><strong>Email :</strong> {{ $rental->user->email }}</p>
                <p><strong>Téléphone :</strong> {{ $rental->user->phone ?? 'À préciser lors du retrait' }}</p>
                <p><strong>Permis de conduire :</strong> {{ $rental->user->license_number ?? 'Original requis au départ' }}</p>
            </td>
            <td width="4%">&nbsp;</td>
            <!-- INFORMATIONS VÉHICULE -->
            <td width="48%" class="info-card">
                <h3>🚗 Véhicule Attribué</h3>
                <p><strong>Modèle :</strong> {{ $rental->vehicle->brand }} {{ $rental->vehicle->model }} ({{ $rental->vehicle->year }})</p>
                <p><strong>Immatriculation :</strong> <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-weight: bold;">{{ $rental->vehicle->license_plate }}</span></p>
                <p><strong>Catégorie :</strong> {{ $rental->vehicle->category->name ?? 'Véhicule de tourisme' }}</p>
                <p><strong>Spécifications :</strong> {{ ucfirst($rental->vehicle->transmission ?? 'Automatique') }} &bull; {{ ucfirst($rental->vehicle->fuel_type ?? 'Essence') }} &bull; {{ $rental->vehicle->seats ?? 5 }} places</p>
            </td>
        </tr>
    </table>

    <!-- SECTION ESSENTIELLE : MODALITÉS DU JOUR DE DÉPART & RESTITUTION -->
    <div class="pickup-section">
        <div class="pickup-header">📍 Prise en Charge & Restitution du Véhicule</div>
        
        <table class="pickup-table">
            <tr>
                <!-- PRISE EN CHARGE (DÉPART) -->
                <td class="pickup-box">
                    <div class="pickup-label">🛫 DÉPART / PRISE EN CHARGE</div>
                    <div class="pickup-val">{{ \Carbon\Carbon::parse($rental->start_date)->translatedFormat('l d F Y') }}</div>
                    <div class="pickup-sub"><strong>Heure de mise à disposition :</strong> à partir de 08:00 (ou selon vol)</div>
                    <div class="pickup-sub" style="margin-top: 4px;">
                        <strong>Lieu de retrait :</strong><br>
                        <span style="color: #1e3a8a; font-weight: bold;">{{ $rental->pickup_location ?: "Agence Centrale Toumaï Drive (N'Djamena)" }}</span>
                    </div>
                </td>
                <td width="4%">&nbsp;</td>
                <!-- RESTITUTION (RETOUR) -->
                <td class="pickup-box">
                    <div class="pickup-label">🛬 RETOUR / RESTITUTION</div>
                    <div class="pickup-val">{{ \Carbon\Carbon::parse($rental->end_date)->translatedFormat('l d F Y') }}</div>
                    <div class="pickup-sub"><strong>Heure limite de restitution :</strong> avant 18:00</div>
                    <div class="pickup-sub" style="margin-top: 4px;">
                        <strong>Lieu de retour :</strong><br>
                        <span style="color: #1e3a8a; font-weight: bold;">{{ $rental->return_location ?: "Agence Centrale Toumaï Drive (N'Djamena)" }}</span>
                    </div>
                </td>
            </tr>
        </table>

        @if(!empty($rental->notes))
        <div style="margin-top: 8px; background: #ffffff; border: 1px dashed #93c5fd; padding: 6px 10px; border-radius: 4px; font-size: 10px;">
            <strong>📝 Instructions particulières client :</strong> {{ $rental->notes }}
        </div>
        @endif
    </div>

    <!-- CHECKLIST DU JOUR DU DÉPART -->
    <div class="checklist-box">
        <div class="checklist-title">📋 Checklist le jour du départ (Prise en charge)</div>
        <table class="checklist-items">
            <tr>
                <td width="50%">✔ <strong>Permis de conduire :</strong> Original physique valide obligatoire (+2 ans d'ancienneté).</td>
                <td width="50%">✔ <strong>Carburant :</strong> Véhicule remis plein, à restituer avec le même niveau.</td>
            </tr>
            <tr>
                <td width="50%">✔ <strong>Pièce d'identité :</strong> CNI ou Passeport original en cours de validité.</td>
                <td width="50%">✔ <strong>État des lieux :</strong> Fiche contradictoire signée avant remise des clés.</td>
            </tr>
            <tr>
                <td width="50%">✔ <strong>Caution / Dépôt :</strong> Prévoir le moyen de dépôt de garantie à la remise.</td>
                <td width="50%">✔ <strong>Assistance 24/7 :</strong> Contact d'urgence disponible en cas de besoin sur la route.</td>
            </tr>
        </table>
    </div>

    <!-- DÉTAILS FINANCIERS -->
    <table class="items-table">
        <thead>
            <tr>
                <th align="left">Désignation</th>
                <th align="center" width="15%">Durée</th>
                <th align="right" width="20%">Tarif Journalier</th>
                <th align="right" width="22%">Montant Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>Location véhicule : {{ $rental->vehicle->brand }} {{ $rental->vehicle->model }}</strong><br>
                    <span style="color: #64748b; font-size: 9.5px;">Immatriculation {{ $rental->vehicle->license_plate }} &bull; Du {{ $rental->start_date }} au {{ $rental->end_date }}</span>
                </td>
                <td align="center">{{ $rental->total_days }} jour(s)</td>
                <td align="right">{{ number_format($rental->daily_rate, 0, ',', ' ') }} FCFA</td>
                <td align="right">{{ number_format($rental->subtotal, 0, ',', ' ') }} FCFA</td>
            </tr>
            @if($rental->insurance_total > 0 && $rental->insurance)
            <tr>
                <td>
                    <strong>Protection & Assurance : {{ $rental->insurance->name }}</strong><br>
                    <span style="color: #64748b; font-size: 9.5px;">Couverture complémentaire souscrite pour la durée du séjour</span>
                </td>
                <td align="center">{{ $rental->total_days }} jour(s)</td>
                <td align="right">{{ number_format($rental->insurance_rate, 0, ',', ' ') }} FCFA</td>
                <td align="right">{{ number_format($rental->insurance_total, 0, ',', ' ') }} FCFA</td>
            </tr>
            @else
            <tr>
                <td>
                    <strong>Assurance Responsabilité Civile au tiers</strong><br>
                    <span style="color: #64748b; font-size: 9.5px;">Protection de base obligatoire incluse d'office</span>
                </td>
                <td align="center">{{ $rental->total_days }} jour(s)</td>
                <td align="right">Inclus</td>
                <td align="right">0 FCFA</td>
            </tr>
            @endif
            <tr class="total-row">
                <td colspan="3" align="right">TOTAL DE LA LOCATION :</td>
                <td align="right" class="total-amount">{{ number_format($rental->total_amount, 0, ',', ' ') }} FCFA</td>
            </tr>
        </tbody>
    </table>

    <!-- RÈGLEMENT & SIGNATURES -->
    <table width="100%" style="border-collapse: collapse; margin-top: 5px;">
        <tr>
            <td width="55%" style="vertical-align: top; font-size: 10px; color: #475569;">
                @if($rental->payment)
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 10px; border-radius: 4px;">
                        <strong style="color: #166534;">Règlement enregistré :</strong><br>
                        Réf. Transaction : <strong>{{ $rental->payment->transaction_id ?? 'TX-' . $rental->id }}</strong><br>
                        Mode : <strong>{{ ucfirst($rental->payment->payment_method ?? 'Paiement sécurisé') }}</strong> le {{ $rental->payment->paid_at ? \Carbon\Carbon::parse($rental->payment->paid_at)->format('d/m/Y') : $date }}
                    </div>
                @else
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 4px;">
                        <strong>Modalité de paiement :</strong> Règlement à finaliser selon les conditions convenues avant la prise en charge du véhicule.
                    </div>
                @endif
            </td>
            <td width="5%">&nbsp;</td>
            <td width="40%" style="vertical-align: top; text-align: center; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 6px;">
                <div style="font-size: 9.5px; color: #64748b; margin-bottom: 25px;">Cachet de l'Agence & Signature Client :</div>
                <div style="font-size: 9px; color: #94a3b8;">Pour acceptation des conditions de location</div>
            </td>
        </tr>
    </table>

    <!-- PIED DE PAGE -->
    <div class="footer-note">
        <p style="margin: 2px 0;">
            Toumaï Drive SARL &bull; Service Client & Assistance 24h/24 : 
            <span class="footer-contacts">+235 66 00 00 00</span> &bull; 
            <span class="footer-contacts">support@toumaidrive.com</span>
        </p>
        <p style="margin: 2px 0; font-size: 8.5px; color: #94a3b8;">
            Ce document tient lieu de bon de réservation et de confirmation officielle de prise en charge. Merci de votre confiance et bon voyage !
        </p>
    </div>

</body>
</html>