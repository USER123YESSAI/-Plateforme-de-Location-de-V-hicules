"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

export default function NewVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        const categoriesData = response.data.data || response.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, category_id: String(categoriesData[0].id) }));
        }
      } catch (error) {
        console.error("[Location Express] Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

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

      await api.post('/vehicles', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Véhicule ajouté avec succès !");
      router.push('/admin/vehicles');
    } catch (error: any) {
      console.error("[Location Express] Failed to create vehicle:", error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Erreur lors de l'ajout du véhicule";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Ajouter un Véhicule</h1>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Image du véhicule</label>
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
        
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/vehicles')}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </div>
      </form>
    </div>
  );
}
