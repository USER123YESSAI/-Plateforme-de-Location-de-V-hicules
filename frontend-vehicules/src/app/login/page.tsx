"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { BackButton } from '@/components/ui/back-button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.access_token || response.data.token;
      const user = response.data.user;
      login(token, user);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-3">
        <div>
          <BackButton href="/" label="Retour à l'accueil" />
        </div>
        <div className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Location Express</h1>
            <p className="text-gray-600">Votre plateforme de location de véhicules</p>
            <h2 className="text-2xl font-bold tracking-tight mt-6">Connexion</h2>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="password">Mot de passe</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
