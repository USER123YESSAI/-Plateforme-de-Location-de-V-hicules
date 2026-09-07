import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Scale,
  FileText,
  ShieldCheck,
  Calendar,
  Car,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export const metadata = {
  title: "Conditions d’utilisation | Location Express",
  description: "Consultez les conditions générales d’utilisation et de location de véhicules sur la plateforme Location Express.",
};

export default function TermsPage() {
  const lastUpdated = "1 septembre 2026";
  const version = "1.0";

  const sections = [
    { id: "preambule", title: "1. Préambule & Objet" },
    { id: "eligibilite", title: "2. Éligibilité & Inscription" },
    { id: "reservation", title: "3. Réservation & Confirmation" },
    { id: "tarifs", title: "4. Tarifs, Caution & Paiement" },
    { id: "restitution", title: "5. Prise en charge & Restitution" },
    { id: "assurance", title: "6. Assurance & Responsabilité" },
    { id: "annulation", title: "7. Annulation & Modification" },
    { id: "modifications", title: "8. Mises à jour des conditions" },
    { id: "litiges", title: "9. Droit applicable & Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Switcher Onglets Droit & Confidentialité */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
              <span className="px-5 py-2 rounded-lg bg-card text-foreground font-semibold text-sm shadow-sm flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Conditions d’utilisation
              </span>
              <Link
                href="/politique-confidentialite"
                className="px-5 py-2 rounded-lg text-muted-foreground hover:text-foreground font-medium text-sm transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Politique de confidentialité
              </Link>
            </div>
          </div>

          {/* En-tête du document */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Scale className="h-3.5 w-3.5" />
              <span>Document légal officiel • Version {version}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Conditions Générales d’Utilisation
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Ces conditions régissent l’utilisation des services de réservation et de location de véhicules proposés par la plateforme Location Express.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Dernière mise à jour : {lastUpdated}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sommaire latéral (Desktop) */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24 space-y-2 p-4 rounded-xl border bg-card/60 backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Sommaire
                </h3>
                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block text-xs py-1.5 px-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
                <div className="pt-4 mt-4 border-t">
                  <Link
                    href="/politique-confidentialite"
                    className="group text-xs text-primary font-medium flex items-center justify-between hover:underline"
                  >
                    <span>Voir la confidentialité</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8 text-foreground/90">
              {/* Section 1 */}
              <section id="preambule" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">1. Préambule & Objet</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Les présentes Conditions Générales d’Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles la société Location Express met à disposition de ses utilisateurs sa plateforme numérique de réservation et propose ses services de location de véhicules automobiles au Tchad.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Toute inscription sur la plateforme ou confirmation de réservation implique l’acceptation pleine, entière et sans réserve des présentes conditions par l’utilisateur.
                </p>
              </section>

              {/* Section 2 */}
              <section id="eligibilite" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">2. Éligibilité & Inscription</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pour louer un véhicule et créer un compte sur la plateforme, l’utilisateur doit satisfaire aux conditions cumulatives suivantes :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Être âgé au minimum de <strong>21 ans révolus</strong> au jour de la prise en charge du véhicule.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Être titulaire d’un <strong>permis de conduire valide</strong> depuis au moins deux (2) ans, correspondant à la catégorie du véhicule réservé.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Fournir des informations exactes, complètes et à jour lors de l’inscription et de la validation du profil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Présenter une pièce d’identité nationale ou un passeport en cours de validité lors de la prise en charge physique.</span>
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="reservation" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Car className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">3. Réservation & Confirmation</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  La réservation d’un véhicule s’effectue en ligne via la plateforme. Le contrat de location est réputé conclu dès validation de la réservation par Location Express et réception de l’e-mail de confirmation reprenant les dates, le tarif et les caractéristiques du véhicule loué.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  En cas d’indisponibilité exceptionnelle du modèle choisi (panne imprévue, retard de restitution du locataire précédent), Location Express s’engage à fournir un véhicule de catégorie équivalente ou supérieure sans surcoût, ou à procéder au remboursement intégral des sommes versées.
                </p>
              </section>

              {/* Section 4 */}
              <section id="tarifs" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">4. Tarifs, Caution & Paiement</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Les tarifs applicables sont ceux affichés sur la plateforme lors de la validation de la réservation. Ils sont exprimés en Francs CFA (XAF) toutes taxes comprises (TTC).
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Moyens de paiement :</strong> Carte bancaire, virement, ou Mobile Money (Airtel Money, Moov Money) selon les modalités indiquées.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Dépôt de garantie (caution) :</strong> Une pré-autorisation ou caution est exigée lors de la remise des clés afin de garantir l’exécution des obligations contractuelles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Carburant :</strong> Le véhicule est remis avec un niveau de carburant déterminé et doit être restitué avec un niveau identique. À défaut, les frais de réapprovisionnement seront facturés.</span>
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="restitution" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">5. Prise en charge & Restitution</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Un état des lieux contradictoire de l’état de carrosserie, des accessoires et du kilométrage est réalisé au départ et à la fin de la location. Toute anomalie ou dégât non signalé au départ sera imputable au locataire.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Le locataire s’engage à restituer le véhicule à la date, à l’heure et au lieu convenus. Tout retard non autorisé supérieur à deux (2) heures entraînera la facturation d’une journée de location supplémentaire assortie d’une indemnité administrative.
                </p>
              </section>

              {/* Section 6 */}
              <section id="assurance" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">6. Assurance & Responsabilité</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tous les véhicules proposés par Location Express bénéficient d’une assurance responsabilité civile obligatoire ainsi que de garanties complémentaires (dommages collision, vol) selon la formule souscrite.
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Exclusions impératives de garantie :</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-6">
                    L’assurance ne couvre en aucun cas les sinistres survenus sous l’emprise d’alcool ou de stupéfiants, la conduite par un tiers non désigné au contrat, le transport illicite de marchandises ou la dégradation volontaire du véhicule.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="annulation" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">7. Annulation & Modification</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Le client peut annuler ou modifier sa réservation selon les conditions suivantes :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Plus de 48 heures avant la prise en charge :</strong> Annulation gratuite avec remboursement intégral.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Entre 48 heures et 24 heures :</strong> Retenue de 30% du montant total de la réservation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Moins de 24 heures ou non-présentation (« no-show ») :</strong> La totalité du montant de la première journée reste acquise à Location Express.</span>
                  </li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="modifications" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Scale className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">8. Mises à jour des conditions</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Location Express se réserve le droit de modifier les présentes CGU à tout moment pour s’adapter aux évolutions légales, réglementaires ou fonctionnelles.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  En cas de révision substantielle, les utilisateurs enregistrés seront informés via la plateforme et invités à accepter la nouvelle version lors de leur connexion suivante pour pouvoir continuer à utiliser le service de réservation.
                </p>
              </section>

              {/* Section 9 */}
              <section id="litiges" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">9. Droit applicable & Contact</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Les présentes conditions sont soumises à la législation en vigueur en République du Tchad. En cas de différend relatif à la validité, l’interprétation ou l’exécution du présent contrat, les parties privilégieront une résolution amiable avant toute saisine des juridictions compétentes de N&apos;Djamena.
                </p>
                <div className="pt-3 border-t flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>contact@locationexpress.td</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+235 66 00 00 00</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
