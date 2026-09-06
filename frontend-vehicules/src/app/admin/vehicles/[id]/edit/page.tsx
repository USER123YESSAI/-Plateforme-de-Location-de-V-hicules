"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { VehicleImage } from "@/components/ui/vehicle-image";

interface Category {
  id: number;
  name: string;
}

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    license_plate: '',
    year: '',
    daily_rate: '',
    category_id: '',
    fuel_type: 'essence',
    transmission: 'manual',
    seats: '5',
    mileage: '0',
    status: 'available'
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleResponse = await api.get(`/vehicles/${params.id}`);
        const vehicle = vehicleResponse.data.data || vehicleResponse.data;
        
        setFormData({
          brand: vehicle.brand,
          model: vehicle.model,
          license_plate: vehicle.license_plate,
          year: String(vehicle.year),
          daily_rate: String(vehicle.daily_rate),
          category_id: String(vehicle.category_id),
          fuel_type: vehicle.fuel_type,
          transmission: vehicle.transmission,
          seats: String(vehicle.seats),
          mileage: String(vehicle.mileage),
          status: vehicle.status
        });
        setCurrentImage(vehicle.image);

        const categoriesResponse = await api.get('/categories');
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("[Location Express] Failed to fetch vehicle data for editing:", error);
        setError("Erreur lors de la récupération des données");
        toast.error("Impossible de charger les données du véhicule");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) {
        data.append('image', image);
      }

      await api.put(`/vehicles/${params.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Véhicule modifié avec succès !");
      router.push('/admin/vehicles');
    } catch (error: any) {
      console.error("[Location Express] Failed to update vehicle:", error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Erreur lors de la modification du véhicule";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement des données du véhicule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Modifier le Véhicule</h1>
        <p className="text-sm text-muted-foreground">Mettez à jour les caractéristiques, tarifs et disponibilité de ce véhicule.</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-8 rounded-lg border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {currentImage && (
            <div className="w-32 h-24 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
              <VehicleImage 
                src={getImageUrl(currentImage)} 
                alt={`${formData.brand} ${formData.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium">Changer l'image (optionnel)</label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)} 
              className="mt-1 file:text-primary file:font-semibold" 
            />
            <p className="text-xs text-muted-foreground">Laissez vide pour conserver l'image actuelle.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <select 
              value={formData.category_id} 
              onChange={(e) => setFormData({...formData, category_id: e.target.value})} 
              required 
              className="mt-1 w-full p-2 border rounded-md bg-background text-sm focus:ring-1 focus:ring-primary"
            >
              {categories.length === 0 ? (
                <option value="">Chargement des catégories...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Statut</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})} 
              required 
              className="mt-1 w-full p-2 border rounded-md bg-background text-sm focus:ring-1 focus:ring-primary"
            >
              <option value="available">Disponible</option>
              <option value="rented">En location</option>
              <option value="maintenance">En maintenance</option>
              <option value="unavailable">Indisponible</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Marque</label>
            <Input 
              value={formData.brand} 
              onChange={(e) => setFormData({...formData, brand: e.target.value})} 
              required 
              className="mt-1" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Modèle</label>
            <Input 
              value={formData.model} 
              onChange={(e) => setFormData({...formData, model: e.target.value})} 
              required 
              className="mt-1" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Immatriculation</label>
            <Input 
              value={formData.license_plate} 
              onChange={(e) => setFormData({...formData, license_plate: e.target.value})} 
              required 
              className="mt-1 uppercase" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Année</label>
            <Input 
              type="number" 
              value={formData.year} 
              onChange={(e) => setFormData({...formData, year: e.target.value})} 
              required 
              className="mt-1" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tarif journalier (FCFA)</label>
            <Input 
              type="number" 
              step="1" 
              value={formData.daily_rate} 
              onChange={(e) => setFormData({...formData, daily_rate: e.target.value})} 
              required 
              className="mt-1" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Carburant</label>
            <select 
              value={formData.fuel_type} 
              onChange={(e) => setFormData({...formData, fuel_type: e.target.value})} 
              required 
              className="mt-1 w-full p-2 border rounded-md bg-background text-sm focus:ring-1 focus:ring-primary"
            >
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Électrique</option>
              <option value="hybrid">Hybride</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Transmission</label>
            <select 
              value={formData.transmission} 
              onChange={(e) => setFormData({...formData, transmission: e.target.value})} 
              required 
              className="mt-1 w-full p-2 border rounded-md bg-background text-sm focus:ring-1 focus:ring-primary"
            >
              <option value="manual">Manuelle</option>
              <option value="automatic">Automatique</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Nombre de places</label>
            <Input 
              type="number" 
              value={formData.seats} 
              onChange={(e) => setFormData({...formData, seats: e.target.value})} 
              required 
              className="mt-1" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Kilométrage (km)</label>
            <Input 
              type="number" 
              value={formData.mileage} 
              onChange={(e) => setFormData({...formData, mileage: e.target.value})} 
              required 
              className="mt-1" 
            />
          </div>
        </div>
        
        <div className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/vehicles')}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
}
