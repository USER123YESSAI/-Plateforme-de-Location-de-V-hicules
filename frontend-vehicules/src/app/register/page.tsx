"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password, password_confirmation: passwordConfirmation });
      router.push('/login');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data) {
        const errorData = err.response.data;
        const firstKey = Object.keys(errorData)[0];
        const val = errorData[firstKey];
        setError(Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : 'Erreur de validation.'));
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8 space-y-8 border">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Location Express</h1>
            <p className="text-gray-600">Votre plateforme de location de véhicules</p>
            <h2 className="text-2xl font-bold tracking-tight mt-6">Inscription</h2>
            <p className="text-gray-500 mt-2">Créez un nouveau compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="name">Nom complet</label>
                <Input id="name" type="text" placeholder="Asra Michel" value={name} onChange={(e) => setName(e.target.value)} required className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="nom@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="password">Mot de passe</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="password_confirmation">Confirmer le mot de passe</label>
                <Input id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required className="mt-2" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
