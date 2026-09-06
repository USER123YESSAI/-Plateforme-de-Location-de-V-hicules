"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { getImageUrl, formatPrice } from "@/lib/utils";

type Insurance = {
  id: number;
  name: string;
  description: string;
  coverage: string;
  daily_rate: number;
};

type Quote = {
  total_days: number;
  daily_rate: number;
  subtotal: number;
  insurance_name: string | null;
  insurance_daily: number;
  insurance_total: number;
  total_amount: number;
};

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  
  // Form fields
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [pickupLocation, setPickupLocation] = useState('Agence principale');
  const [returnLocation, setReturnLocation] = useState('Agence principale');
  const [insuranceId, setInsuranceId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Availability & Quote
  const [quote, setQuote] = useState<Quote | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleRes = await api.get(`/vehicles/${params.id}`);
        setVehicle(vehicleRes.data.data || vehicleRes.data);

        const insRes = await api.get('/insurances');
        setInsurances(insRes.data.data || insRes.data || []);
      } catch (error) {
        console.error("[Location Express] Failed to fetch vehicle details/insurances:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  // Run availability check and pricing quote whenever dates or insurance changes
  useEffect(() => {
    if (!vehicle || !startDate || !endDate) return;

    const checkAvailabilityAndQuote = async () => {
      setChecking(true);
      setQuote(null);
      setAvailabilityMessage(null);
      setIsAvailable(null);

      try {
        const res = await api.get('/rentals/check-availability', {
          params: {
            vehicle_id: vehicle.id,
            start_date: startDate,
            end_date: endDate,
            insurance_id: insuranceId || undefined
          }
        });

        if (res.data.success) {
          setIsAvailable(true);
          setQuote(res.data.data.calculation);
        } else {
          setIsAvailable(false);
          setAvailabilityMessage(res.data.data.message || 'Véhicule indisponible pour ces dates.');
        }
      } catch (error: any) {
        setIsAvailable(false);
        setAvailabilityMessage(error.response?.data?.message || 'Erreur lors de la vérification de disponibilité.');
      } finally {
        setChecking(false);
      }
    };

    const timer = setTimeout(checkAvailabilityAndQuote, 400);
    return () => clearTimeout(timer);
  }, [vehicle, startDate, endDate, insuranceId]);

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'admin') {
      alert("Les administrateurs ne peuvent pas effectuer de réservations.");
      return;
    }
    if (!isAvailable) {
      alert("Le véhicule n'est pas disponible pour les dates choisies.");
      return;
    }
    setBooking(true);
    try {
      await api.post('/rentals', {
        vehicle_id: vehicle?.id,
        start_date: startDate,
        end_date: endDate,
        pickup_location: pickupLocation,
        return_location: returnLocation,
        insurance_id: insuranceId ? parseInt(insuranceId) : null,
        notes: notes || null
      });
      alert('Réservation effectuée avec succès !');
      router.push('/client/my-rentals');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!vehicle) return <div className="min-h-screen flex items-center justify-center">Véhicule introuvable.</div>;

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <main className="container py-10 max-w-6xl">
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column: Image and details */}
          <div className="lg:w-1/2 bg-muted relative flex flex-col justify-between p-6 border-r">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-background border">
              {vehicle.image ? (
                <img 
                  src={getImageUrl(vehicle.image) || ""} 
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
                  {vehicle.brand} {vehicle.model}
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <span className="uppercase tracking-wide text-xs text-primary font-bold px-2.5 py-1 bg-primary/10 rounded-full">
                  {vehicle.category?.name || 'Catégorie Standard'}
                </span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
                  {vehicle.brand} {vehicle.model}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                <div>
                  <span className="text-muted-foreground block">Immatriculation</span>
                  <span className="font-semibold">{vehicle.license_plate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Année</span>
                  <span className="font-semibold">{vehicle.year}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Transmission</span>
                  <span className="font-semibold capitalize">{vehicle.transmission}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Carburant</span>
                  <span className="font-semibold capitalize">{vehicle.fuel_type}</span>
                </div>
              </div>

              <div className="pt-6 border-t flex justify-between items-baseline">
                <span className="text-muted-foreground">Tarif journalier de base</span>
                <span className="text-2xl font-bold text-foreground">{formatPrice(vehicle.daily_rate)} <span className="text-sm font-normal text-muted-foreground">/jour</span></span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Quote / Booking Form */}
          <div className="p-8 lg:w-1/2 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Réserver ce véhicule</h2>
              
              {user?.role === 'admin' ? (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm mb-6">
                  Vous êtes connecté en tant qu'<strong>administrateur</strong>. Les réservations sont réservées aux comptes clients.
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date de début</label>
                    <input 
                      type="date" 
                      min={todayStr} 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full mt-1.5 p-2.5 border rounded-lg bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date de fin</label>
                    <input 
                      type="date" 
                      min={startDate || todayStr} 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full mt-1.5 p-2.5 border rounded-lg bg-background text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lieu de prise en charge</label>
                    <input 
                      type="text" 
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full mt-1.5 p-2.5 border rounded-lg bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lieu de restitution</label>
                    <input 
                      type="text" 
                      value={returnLocation}
                      onChange={(e) => setReturnLocation(e.target.value)}
                      className="w-full mt-1.5 p-2.5 border rounded-lg bg-background text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assurance optionnelle</label>
                  <select 
                    value={insuranceId} 
                    onChange={(e) => setInsuranceId(e.target.value)}
                    className="w-full mt-1.5 p-2.5 border rounded-lg bg-background text-sm"
                  >
                    <option value="">Aucune (Tiers par défaut)</option>
                    {insurances.map(ins => (
                      <option key={ins.id} value={ins.id}>
                        {ins.name} (+{formatPrice(ins.daily_rate)}/jour) - {ins.coverage}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes de réservation</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instructions ou demandes spéciales..."
                    className="w-full mt-1.5 p-2.5 border rounded-lg bg-background text-sm h-16 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Price calculation summary */}
            <div className="pt-6 border-t">
              {checking ? (
                <div className="text-center py-4 text-muted-foreground text-sm">Calcul du devis...</div>
              ) : isAvailable === false ? (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
                  {availabilityMessage}
                </div>
              ) : quote ? (
                <div className="bg-muted/40 p-4 rounded-xl space-y-2.5 border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location de base ({quote.total_days} jour{quote.total_days > 1 ? 's' : ''})</span>
                    <span>{formatPrice(quote.subtotal)}</span>
                  </div>
                  {quote.insurance_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assurance ({quote.insurance_name})</span>
                      <span>+{formatPrice(quote.insurance_total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t text-foreground">
                    <span>Total Estimé</span>
                    <span>{formatPrice(quote.total_amount)}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="pt-4">
              <Button 
                size="lg" 
                className="w-full text-lg h-14" 
                onClick={handleBooking} 
                disabled={booking || checking || !isAvailable || vehicle.status !== 'available' || user?.role === 'admin'}
              >
                {vehicle.status !== 'available' ? 'Indisponible' : 
                 user?.role === 'admin' ? 'Réservé aux Clients' :
                 booking ? 'Réservation...' : 'Confirmer la réservation'}
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
