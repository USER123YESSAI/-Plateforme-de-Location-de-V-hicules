# 📱 Toumaï Drive — Application Mobile (React Native & Expo)

Bienvenue sur le projet mobile de **Toumaï Drive**, développé avec **React Native**, **Expo SDK** et **TypeScript**.

Cette application permet aux clients de parcourir le parc automobile, réserver un véhicule en direct, suivre leurs locations et consulter leur bon officiel de prise en charge directement depuis leur smartphone.

---

## ⚡ Démarrage Rapide (Tester sur son propre smartphone avec Expo Go)

Vous pouvez tester l'application directement sur votre téléphone en moins de 2 minutes, sans avoir besoin d'installer Android Studio ni Xcode :

### 1. Télécharger l'application gratuite Expo Go
- **Sur iPhone (iOS) :** Recherchez [Expo Go sur l'App Store](https://apps.apple.com/app/expo-go/id982107779).
- **Sur smartphone Android :** Recherchez [Expo Go sur Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).

### 2. Installer les dépendances du projet
Dans le dossier `mobile-vehicules` :
```bash
npm install
```

### 3. Configurer l'adresse de votre API
Ouvrez le fichier `.env` dans `mobile-vehicules` :
- **Sur smartphone réel avec Expo Go :** Mettez l'adresse IP locale de votre ordinateur sur le même réseau Wi-Fi (ex: `http://192.168.1.50:8000/api`) ou l'URL de production Render :
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.50:8000/api
  ```
- **Sur émulateur Android Studio :**
  ```env
  EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api
  ```
- **Sur simulateur iOS ou Web :**
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:8000/api
  ```

### 4. Démarrer le serveur Expo
```bash
npm start
```
Un **QR Code interactif** apparaît dans votre terminal !

### 5. Ouvrir l'application sur votre smartphone
- **Sur iPhone :** Ouvrez simplement l'appareil photo du téléphone et pointez le QR Code affiché sur votre écran d'ordinateur. Cliquez sur la notification pour ouvrir dans **Expo Go**.
- **Sur Android :** Ouvrez l'application **Expo Go**, appuyez sur **« Scan QR Code »** et scannez le code.

---

## 🔑 Comptes de Test

Pour faciliter vos tests, un bouton de remplissage automatique en un clic est disponible sur l'écran de connexion :

| Rôle | Email | Mot de passe | Description |
| :--- | :--- | :--- | :--- |
| **Client Test** | `client@example.com` | `client123` | Compte de démonstration préconfiguré avec réservations actives |

Vous pouvez également créer un nouveau compte client à tout moment via l'écran **« Inscription »**.

---

## 🌟 Fonctionnalités Incluses

- 🚗 **Catalogue interactif des véhicules** : filtrage horizontal par catégorie (*Économique, Compact, SUV, Luxe*), affichage des photos réelles haute définition, spécifications (boîte, énergie, places) et tarif par jour en FCFA.
- 🔍 **Recherche et filtres avancés** : recherche par mot-clé, filtre par transmission (automatique/manuelle) et par carburant.
- 📅 **Réservation dynamique en temps réel** :
  - Sélection des dates de prise en charge et de retour.
  - Choix du point de retrait (*Aéroport Hassan Djamous*, Agence Sabangali, etc.).
  - Sélection des options d'assurance.
  - Calcul instantané du coût total via l'API.
- 📋 **Bon de Prise en Charge officiel & Checklist** :
  - Modalités précises du jour du départ (lieu, date, heure de mise à disposition).
  - Checklist obligatoire : permis physique valide, pièce d'identité, état des lieux, carburant.
  - Boutons d'appel d'urgence direct et assistance WhatsApp 24/7 vers l'agence Toumaï Drive.
- 👤 **Gestion du profil client** : coordonnées, numéro de permis de conduire et déconnexion sécurisée.
- 🔐 **Sécurité** : jeton JWT stocké de façon chiffrée via `expo-secure-store`.

---

## 🛠 Commandes utiles

```bash
# Lancer le serveur Metro Bundler
npm start

# Lancer sur l'émulateur Android (si installé)
npm run android

# Lancer sur le simulateur iOS (sur Mac)
npm run ios

# Lancer sur navigateur Web
npm run web
```
