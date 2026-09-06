"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TestApi() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Appelle une route publique de l'API Laravel
      const response = await api.get('/vehicles/available');
      setData(response.data);
    } catch (err: any) {
      console.error("[Location Express] API connection failed:", err);
      setError(err.message || 'Erreur lors de la connexion à l\'API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Test de Communication API</h1>
      
      <div className="space-y-4 w-full max-w-2xl bg-card p-6 rounded-lg shadow-sm border">
        <div className="flex gap-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Tester la connexion Backend'}
          </Button>
          <Link href="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md mt-4">
            <strong>Erreur :</strong> {error}
            <p className="text-sm mt-2">Vérifiez que le serveur Laravel tourne sur le port 8000 et que le CORS est autorisé.</p>
          </div>
        )}

        {data && (
          <div className="mt-4">
            <h3 className="font-semibold text-green-600 mb-2">✅ Connexion réussie ! Données reçues :</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
