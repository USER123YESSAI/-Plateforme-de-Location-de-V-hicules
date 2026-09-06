"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

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
        // Fetch vehicle
        const vehicleResponse = await api.get(`/vehicles/${params.id}`);
        const vehicle = vehicleResponse.data.data || vehicleResponse.data;
        
        setFormData({
          brand: vehicle.brand,
          model: vehicle.model,
          license_plate: vehicle.license_plate,
          year: vehicle.year,
          daily_rate: vehicle.daily_rate,
          category_id: vehicle.category_id,
          fuel_type: vehicle.fuel_type,
          transmission: vehicle.transmission,
          seats: vehicle.seats,
          mileage: vehicle.mileage,
          status: vehicle.status
        });
        setCurrentImage(vehicle.image);

        // Fetch categories
        const categoriesResponse = await api.get('/categories');
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("[Location Express] Failed to fetch vehicle data for editing:", error);
        setError("Erreur lors de la récupération des données");
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
      router.push('/admin/vehicles');
    } catch (error: any) {
      console.error("[Location Express] Failed to update vehicle:", error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Erreur lors de la modification du véhicule";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Modifier le Véhicule</h1>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Image actuelle</label>
          {currentImage && (
            <img 
              src={getImageUrl(currentImage) || ""} 
              alt="Image actuelle"
              className="mt-2 w-32 h-24 object-cover rounded border bg-muted"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Changer l'image</label>
          <Input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)} 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Catégorie</label>
          <select 
            value={formData.category_id} 
            onChange={(e) => setFormData({...formData, category_id: e.target.value})} 
            required 
            className="mt-1 w-full p-2 border rounded-md"
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
          <label className="text-sm font-medium">Marque</label>
          <Input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Modèle</label>
          <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Immatriculation</label>
          <Input value={formData.license_plate} onChange={(e) => setFormData({...formData, license_plate: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Année</label>
          <Input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Prix par jour (FCFA)</label>
          <Input type="number" step="0.01" value={formData.daily_rate} onChange={(e) => setFormData({...formData, daily_rate: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Type de carburant</label>
          <select 
            value={formData.fuel_type} 
            onChange={(e) => setFormData({...formData, fuel_type: e.target.value})} 
            required 
            className="mt-1 w-full p-2 border rounded-md"
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
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="manual">Manuelle</option>
            <option value="automatic">Automatique</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Nombre de places</label>
          <Input type="number" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Kilométrage</label>
          <Input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Statut</label>
          <select 
            value={formData.status} 
            onChange={(e) => setFormData({...formData, status: e.target.value})} 
            required 
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="available">Disponible</option>
            <option value="rented">Loué</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Indisponible</option>
          </select>
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/vehicles')}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Modification...' : 'Enregistrer'}</Button>
        </div>
      </form>
    </div>
  );
}
