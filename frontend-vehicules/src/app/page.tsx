import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-primary/10 to-background">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Prenez le volant de <br/> <span className="text-primary">votre liberté</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            La plateforme numéro 1 pour louer le véhicule idéal pour vos vacances, déplacements professionnels ou escapades le week-end.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/vehicles">
              <Button size="lg" className="h-12 px-8 text-base">Voir nos véhicules</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">Créer un compte</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pourquoi choisir Location Express ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold mb-2">Large choix de véhicules</h3>
                <p className="text-muted-foreground">Découvrez notre flotte variée : économiques, SUV, premium, utilitaires et plus encore.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Tarifs transparents</h3>
                <p className="text-muted-foreground">Pas de frais cachés. Vous voyez le prix final avant de réserver.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Réservation rapide</h3>
                <p className="text-muted-foreground">Réservez en quelques clics et profitez de votre véhicule instantanément.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-lg font-semibold mb-2">Créez un compte</h3>
                <p className="text-muted-foreground text-sm">Inscription gratuite en moins de 2 minutes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-lg font-semibold mb-2">Choisissez votre véhicule</h3>
                <p className="text-muted-foreground text-sm">Parcourez notre catalogue et trouvez le véhicule idéal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-lg font-semibold mb-2">Réservez en ligne</h3>
                <p className="text-muted-foreground text-sm">Sélectionnez vos dates et validez votre réservation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-lg font-semibold mb-2">Profitez !</h3>
                <p className="text-muted-foreground text-sm">Récupérez votre véhicule et partez à l'aventure</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à partir ?</h2>
            <p className="text-xl mb-10 opacity-90">Rejoignez des milliers de clients satisfaits et découvrez la liberté de location avec Location Express.</p>
            <div className="flex gap-2 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base">Commencer maintenant</Button>
              </Link>
              <Link href="/vehicles">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Voir les véhicules</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
