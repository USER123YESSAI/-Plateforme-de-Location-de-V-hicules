"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";

export default function EditRentalPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    status: 'pending',
    total_amount: ''
  });

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await api.get(`/rentals/${params.id}`);
        const rental = response.data.data || response.data;
        
        setFormData({
          start_date: rental.start_date?.split('T')[0] || '',
          end_date: rental.end_date?.split('T')[0] || '',
          status: rental.status,
          total_amount: rental.total_amount || rental.total_price || ''
        });
      } catch (error) {
        console.error("[Location Express] Failed to fetch rental details for editing:", error);
        setError("Erreur lors de la récupération de la location");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchRental();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/rentals/${params.id}`, formData);
      router.push('/admin/rentals');
    } catch (error: any) {
      console.error("[Location Express] Failed to update rental:", error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Erreur lors de la modification de la location";
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
      <h1 className="text-3xl font-bold tracking-tight">Modifier la Location</h1>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Date de début</label>
          <Input 
            type="date" 
            value={formData.start_date} 
            onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
            required 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Date de fin</label>
          <Input 
            type="date" 
            value={formData.end_date} 
            onChange={(e) => setFormData({...formData, end_date: e.target.value})} 
            required 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Prix total (FCFA)</label>
          <Input 
            type="number" 
            step="0.01" 
            value={formData.total_amount} 
            onChange={(e) => setFormData({...formData, total_amount: e.target.value})} 
            required 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Statut</label>
          <select 
            value={formData.status} 
            onChange={(e) => setFormData({...formData, status: e.target.value})} 
            required 
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="active">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/rentals')}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Modification...' : 'Enregistrer'}</Button>
        </div>
      </form>
    </div>
  );
}
