"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/back-button';
import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Vous devez accepter les Conditions d’utilisation et la Politique de confidentialité pour créer votre compte.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        terms_accepted: termsAccepted,
      });
      router.push('/login');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data) {
        const errorData = err.response.data;
        if (errorData.terms_accepted) {
          const val = errorData.terms_accepted;
          setError(Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : 'Erreur de validation des conditions.'));
        } else if (errorData.errors?.terms_accepted) {
          const val = errorData.errors.terms_accepted;
          setError(Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : 'Erreur de validation des conditions.'));
        } else {
          const dict = errorData.errors || errorData;
          const firstKey = Object.keys(dict)[0];
          const val = dict[firstKey];
          setError(Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : 'Erreur de validation.'));
        }
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'inscription');
      }
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
            <h2 className="text-2xl font-bold tracking-tight mt-6">Inscription</h2>
            <p className="text-gray-500 mt-2">Créez un nouveau compte client</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 text-sm text-red-900 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="name">Nom complet</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Asra Michel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 leading-none" htmlFor="password_confirmation">Confirmer le mot de passe</label>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              {/* Case à cocher obligatoire d'acceptation des conditions */}
              <div className="pt-2">
                <label
                  htmlFor="terms_accepted"
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer select-none ${
                    termsAccepted
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    id="terms_accepted"
                    name="terms_accepted"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    J’accepte les{' '}
                    <Link
                      href="/conditions-utilisation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 inline-flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Conditions d’utilisation
                      <ExternalLink className="h-3 w-3 inline" />
                    </Link>{' '}
                    et la{' '}
                    <Link
                      href="/politique-confidentialite"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 inline-flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Politique de confidentialité
                      <ExternalLink className="h-3 w-3 inline" />
                    </Link>
                    .
                  </span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold shadow-md shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </form>

          <div className="pt-2 text-center text-sm text-gray-600 border-t">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
