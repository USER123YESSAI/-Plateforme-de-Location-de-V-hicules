"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'client'
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${params.id}`);
        const client = response.data.data || response.data;
        
        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone || '',
          address: client.address || '',
          role: client.role
        });
      } catch (error) {
        console.error("[Location Express] Failed to fetch client details for editing:", error);
        setError("Erreur lors de la récupération du client");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchClient();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/clients/${params.id}`, formData);
      router.push('/admin/clients');
    } catch (error: any) {
      console.error("[Location Express] Failed to update client:", error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Erreur lors de la modification du client";
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
      <h1 className="text-3xl font-bold tracking-tight">Modifier le Client</h1>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Nom</label>
          <Input 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Téléphone</label>
          <Input 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Adresse</label>
          <Input 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
            className="mt-1" 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Rôle</label>
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})} 
            required 
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/clients')}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Modification...' : 'Enregistrer'}</Button>
        </div>
      </form>
    </div>
  );
}
