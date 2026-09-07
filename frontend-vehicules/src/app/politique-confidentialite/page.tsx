import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  Scale,
  Lock,
  Eye,
  Database,
  UserCheck,
  FileText,
  Calendar,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export const metadata = {
  title: "Politique de confidentialité | Toumaï Drive",
  description: "Découvrez comment Toumaï Drive protège, traite et respecte vos données personnelles et votre vie privée.",
};

export default function PrivacyPage() {
  const lastUpdated = "1 septembre 2026";
  const version = "1.0";

  const sections = [
    { id: "responsable", title: "1. Responsable de traitement" },
    { id: "donnees", title: "2. Données collectées" },
    { id: "finalites", title: "3. Finalités du traitement" },
    { id: "bases", title: "4. Bases légales" },
    { id: "destinataires", title: "5. Partage & Destinataires" },
    { id: "conservation", title: "6. Durée de conservation" },
    { id: "securite", title: "7. Sécurité des données" },
    { id: "droits", title: "8. Vos droits" },
    { id: "contact", title: "9. Contact & Réclamations" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Switcher Onglets Droit & Confidentialité */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
              <Link
                href="/conditions-utilisation"
                className="px-5 py-2 rounded-lg text-muted-foreground hover:text-foreground font-medium text-sm transition-colors flex items-center gap-2"
              >
                <Scale className="h-4 w-4 text-muted-foreground" />
                Conditions d’utilisation
              </Link>
              <span className="px-5 py-2 rounded-lg bg-card text-foreground font-semibold text-sm shadow-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Politique de confidentialité
              </span>
            </div>
          </div>

          {/* En-tête */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold">
              <Lock className="h-3.5 w-3.5" />
              <span>Protection de vos données • Version {version}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Politique de Confidentialité
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              La protection de votre vie privée et de vos données personnelles est au cœur de nos priorités chez Toumaï Drive.
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
                    href="/conditions-utilisation"
                    className="group text-xs text-primary font-medium flex items-center justify-between hover:underline"
                  >
                    <span>Voir les conditions</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8 text-foreground/90">
              {/* Section 1 */}
              <section id="responsable" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">1. Responsable du traitement</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Le responsable du traitement des données à caractère personnel collectées via le site et les services de Toumaï Drive est la société Toumaï Drive S.A.R.L, ayant son siège à N&apos;Djamena, République du Tchad.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pour toute question relative au traitement de vos informations personnelles, vous pouvez contacter notre référent protection des données par courrier électronique à l’adresse <span className="font-medium text-foreground">privacy@toumaidrive.td</span>.
                </p>
              </section>

              {/* Section 2 */}
              <section id="donnees" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Database className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">2. Données personnelles collectées</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Dans le cadre de l’utilisation de nos services de location, nous collectons les catégories de données suivantes :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border bg-muted/40 space-y-1.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Identité & Contact
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Nom complet, adresse e-mail, numéro de téléphone, adresse postale de résidence.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border bg-muted/40 space-y-1.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Permis & Habilitation
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Numéro de permis de conduire, date d’expiration, catégorie et copie de vérification.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border bg-muted/40 space-y-1.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Données de Réservation
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Historique des locations, véhicules choisis, dates, options d’assurance et paiements.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border bg-muted/40 space-y-1.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Données de Connexion
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Horodatage des connexions, acceptation des conditions juridiques et adresse IP technique.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="finalites" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">3. Finalités de la collecte</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Vos données sont collectées et traitées pour répondre aux finalités strictes suivantes :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Création, gestion et sécurisation de votre compte utilisateur.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Enregistrement et exécution de vos réservations de véhicules et contrats de location.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Facturation, traitement sécurisé des paiements et gestion des cautions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Assistance clientèle, support 7j/7 et gestion des éventuels sinistres d’assurance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Respect des obligations légales, réglementaires, comptables et fiscales.</span>
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="bases" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Scale className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">4. Bases légales du traitement</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Conformément aux principes applicables de protection des données, les traitements reposent sur :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>L’exécution du contrat :</strong> pour traiter votre inscription et livrer le véhicule loué.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>L’obligation légale :</strong> vérification de la capacité juridique de conduire et conservation comptable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Votre consentement explicite :</strong> recueil préalable de votre accord lors de la création de compte.</span>
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="destinataires" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">5. Partage & Destinataires des données</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Toumaï Drive ne commercialise, ne loue ni ne vend vos données personnelles à des tiers. Les destinataires habilités sont uniquement :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Le personnel habilité de Toumaï Drive (agents de comptoir, service client, gestionnaires de flotte).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Les compagnies d’assurance partenaires en cas de sinistre ou d’accident avéré.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Les autorités judiciaires ou policières sur réquisition légale (infractions au code de la route).</span>
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="conservation" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">6. Durée de conservation</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Vos données sont conservées pendant la durée nécessaire à l’accomplissement des finalités pour lesquelles elles ont été collectées :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Compte actif :</strong> Tant que votre compte reste actif et utilisé.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Inactivité :</strong> Suppression ou anonymisation après 3 années d’inactivité totale.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Factures & Contrats :</strong> 10 ans conformément aux obligations comptables et fiscales.</span>
                  </li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="securite" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">7. Sécurité des données</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Toumaï Drive met en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité de vos données contre tout accès non autorisé, altération ou divulgation :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary shrink-0" />
                    <span>Mots de passe hachés via algorithmes robustes (Bcrypt).</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary shrink-0" />
                    <span>Connexions et transferts chiffrés via HTTPS / TLS.</span>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section id="droits" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">8. Vos droits</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Vous disposez à tout moment des droits suivants sur vos données personnelles :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-none pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Droit d’accès :</strong> Vous pouvez obtenir confirmation que vos données sont traitées et en obtenir une copie.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Droit de rectification :</strong> Vous pouvez modifier vos informations inexactes depuis votre espace profil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Droit à l’effacement :</strong> Vous pouvez demander la suppression de votre compte et des données associées, sous réserve des durées légales de conservation.</span>
                  </li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="contact" className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">9. Contact & Réclamations</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pour exercer vos droits ou pour toute réclamation concernant vos données personnelles, veuillez adresser votre demande accompagnée d’un justificatif d’identité :
                </p>
                <div className="pt-3 border-t flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>privacy@toumaidrive.td</span>
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
