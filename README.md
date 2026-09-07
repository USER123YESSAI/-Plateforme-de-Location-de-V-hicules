# 🚗 Toumaï Drive — Plateforme Moderne de Location de Véhicules

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Laravel](https://img.shields.io/badge/Laravel-12-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple?style=flat-square&logo=php)](https://php.net/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Toumaï Drive** est une plateforme web moderne et intuitive de location de véhicules (courte, moyenne et longue durée). Conçue pour offrir une expérience utilisateur fluide, elle combine une vitrine de réservation rapide pour les clients et un panneau d'administration puissant pour la gestion de flotte, le suivi des réservations et l'analyse des revenus.

---

## 📑 Sommaire

- [Aperçu & Fonctionnalités](#-aperçu--fonctionnalités)
- [Architecture & Stack Technique](#-architecture--stack-technique)
- [Structure du Projet](#-structure-du-projet)
- [Installation & Démarrage Local](#-installation--démarrage-local)
  - [Prérequis](#prérequis)
  - [Option 1 : Démarrage Manuel (Recommandé en local)](#option-1--démarrage-manuel)
  - [Option 2 : Démarrage avec Docker Compose](#option-2--démarrage-avec-docker-compose)
- [Comptes de Test (Seeders)](#-comptes-de-test)
- [API & Endpoints Principaux](#-api--endpoints-principaux)
- [Tests & Qualité du Code](#-tests--qualité-du-code)
- [Déploiement en Production](#-déploiement-en-production)

---

## ✨ Aperçu & Fonctionnalités

### 🌐 Côté Client & Public
- **Catalogue interactif de véhicules** : recherche en temps réel, filtres par catégorie (*Économique, Compact, SUV, Luxe*), boîte de vitesses (*automatique/manuelle*), carburant (*essence, diesel, électrique*), et tranche de prix.
- **Fiches véhicules détaillées** : galerie photo haute fidélité, caractéristiques techniques complètes (année, kilométrage, nombre de places, climatisation), et tarification transparente par jour (en FCFA).
- **Réservation intelligente** : sélection des dates de début et de fin, calcul automatique du montant total, options d'assurance et contrôle de disponibilité instantané.
- **Espace Client dédié** :
  - Suivi en temps réel des réservations (*En attente, Confirmée, En cours, Terminée, Annulée*).
  - Gestion du profil utilisateur et historique des trajets.
  - Signature et acceptation des Conditions Générales d'Utilisation.

### 🛡️ Côté Administrateur
- **Tableau de bord statistique** : métriques clés (chiffre d'affaires, total des réservations, véhicules actifs, nouveaux clients).
- **Gestion du parc automobile (CRUD)** : ajout, modification, désactivation et suppression de véhicules avec téléversement d'images.
- **Gestion des catégories** : organisation des gammes de véhicules.
- **Gestion des réservations** : validation, modification de statut et suivi opérationnel.
- **Suivi des paiements & Facturation** : historique des transactions et statuts d'encaissement.
- **Rapports de revenus** : analyse périodique des performances financières de la flotte.

---

## 🛠 Architecture & Stack Technique

| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15** (App Router) | Framework React moderne avec rendu hybride (SSR / Client) |
| **UI & Styling** | **Tailwind CSS + Lucide Icons** | Design système réactif, moderne et accessible |
| **Langage Frontend** | **TypeScript** | Typage statique robuste et intégration API sécurisée |
| **Backend API** | **Laravel 12** | API RESTful élégante, performante et modulaire |
| **Authentification** | **JWT (JSON Web Tokens)** | Sessions stateless sécurisées par Bearer Tokens |
| **Base de Données** | **SQLite** (dév) / **MySQL 8** (prod) | Persistance relationnelle avec migrations et seeders Eloquent |
| **Conteneurisation** | **Docker & Docker Compose** | Environnements reproductibles frontend, backend et base de données |
| **Hébergement Prod** | **Vercel** (Front) + **Render** (Back) | Déploiement continu automatisé à chaque commit sur `main` |

---

## 📂 Structure du Projet

```text
Plateforme de Location de Véhicules/
├── docker-compose.yml           # Configuration Docker multi-conteneurs
├── render.yaml                  # Configuration du déploiement Render (Backend)
├── README.md                    # Documentation complète du projet
│
├── frontend-vehicules/          # Application Frontend Next.js 15
│   ├── src/
│   │   ├── app/                 # Routes Next.js App Router (public, client, admin)
│   │   │   ├── admin/           # Dashboard et gestion administrative
│   │   │   ├── client/          # Espace client et mes réservations
│   │   │   ├── vehicles/        # Catalogue et fiche détaillée
│   │   │   ├── login/           # Page de connexion
│   │   │   └── register/        # Inscription client
│   │   ├── components/          # Composants UI réutilisables (Navbar, Footer, Modals...)
│   │   ├── context/             # Contexte d'authentification AuthContext
│   │   ├── lib/                 # Utilitaires et client API Axios
│   │   └── types/               # Déclarations TypeScript
│   ├── public/                  # Assets statiques (logos Toumaï Drive, favicons)
│   └── package.json
│
└── backend-vehicules/           # API RESTful Laravel 12
    ├── app/
    │   ├── Http/Controllers/   # Contrôleurs API (Auth, Vehicle, Rental, Category...)
    │   └── Models/              # Modèles Eloquent (Vehicle, Rental, User, Payment...)
    ├── database/
    │   ├── migrations/          # Schémas de base de données relationnels
    │   └── seeders/             # Données initiales et véhicules de test
    ├── routes/
    │   └── api.php              # Définition des endpoints REST sécurisés
    ├── storage/app/public/      # Stockage des images des véhicules
    └── tests/                   # Tests automatisés (Unit & Feature)
```

---

## 🚀 Installation & Démarrage Local

### Prérequis
- **PHP** 8.2 ou supérieur avec extensions (`pdo`, `pdo_sqlite`, `pdo_mysql`, `mbstring`, `openssl`).
- **Composer** 2.x
- **Node.js** 18+ et **npm**
- *(Optionnel)* **Docker** & **Docker Compose**

---

### Option 1 : Démarrage Manuel

#### 1. Backend (Laravel)
```bash
cd backend-vehicules

# Installer les dépendances PHP
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Créer le lien symbolique pour les images
php artisan storage:link

# Exécuter les migrations et charger les données de test
php artisan migrate:fresh --seed

# Lancer le serveur de développement
php artisan serve --port=8000
```
> L'API backend est accessible sur : `http://localhost:8000`

#### 2. Frontend (Next.js)
```bash
cd ../frontend-vehicules

# Installer les dépendances Node.js
npm install

# Configurer les variables d'environnement (.env.local)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage

# Lancer l'application en mode développement
npm run dev
```
> L'application frontend est accessible sur : `http://localhost:3000`

---

### Option 2 : Démarrage avec Docker Compose

Pour lancer l'ensemble de la stack (MySQL, Backend Laravel et Frontend Next.js) en une seule commande :

```bash
docker-compose up -d --build
```

---

## 🔑 Comptes de Test

La commande `php artisan db:seed` préconfigure automatiquement les comptes suivants :

| Rôle | Email | Mot de passe | Accès |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@example.com` | `admin123` | Tableau de bord complet `/admin/dashboard` |
| **Client** | `client@example.com` | `client123` | Espace réservation & profil `/client/vehicles` |

---

## 🔌 API & Endpoints Principaux

| Méthode | Route | Description | Authentification |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur | Non |
| `POST` | `/api/auth/login` | Connexion et obtention du JWT | Non |
| `GET` | `/api/auth/me` | Informations du profil connecté | Bearer Token |
| `GET` | `/api/categories` | Liste des catégories de véhicules | Non |
| `GET` | `/api/vehicles` | Catalogue des véhicules (avec filtres) | Non |
| `GET` | `/api/vehicles/{id}` | Détail d'un véhicule spécifique | Non |
| `POST` | `/api/vehicles/check-availability` | Calcul du prix et disponibilité | Non |
| `POST` | `/api/rentals` | Créer une réservation | Client / Admin |
| `GET` | `/api/my-rentals` | Historique des réservations de l'utilisateur | Client |
| `POST` | `/api/admin/vehicles` | Ajouter un véhicule au parc (+ upload photo) | Admin |
| `PUT` | `/api/admin/vehicles/{id}` | Modifier les informations d'un véhicule | Admin |
| `DELETE`| `/api/admin/vehicles/{id}` | Supprimer un véhicule | Admin |
| `GET` | `/api/admin/rentals` | Liste complète des réservations | Admin |
| `GET` | `/api/admin/revenue` | Rapport financier et chiffre d'affaires | Admin |

---

## 🧪 Tests & Qualité du Code

Le projet comprend une suite complète de tests automatisés couvrant les routes d'API, l'authentification et les règles métiers :

```bash
# Exécuter les tests du backend
cd backend-vehicules
php artisan test

# Vérifier la compilation et le typage du frontend
cd ../frontend-vehicules
npm run build
```

---

## 🌐 Déploiement en Production

Le projet est configuré pour le déploiement continu (**CI/CD**) :
1. **Frontend (Next.js)** déployé sur **Vercel** avec optimisations Edge, compression d'images et SSL automatique.
2. **Backend (Laravel)** déployé sur **Render** via Docker avec base de données relationnelle sécurisée.
3. Chaque `git push origin main` déclenche la compilation, les tests et le déploiement direct sans interruption de service.

---

## 📄 Licence
Ce projet est sous licence [MIT](LICENSE).
Développé avec passion pour **Toumaï Drive** 🚗.
