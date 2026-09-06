# TODO - Vérification & correction du projet (avant frontend)

- [x] Étape 1: Corriger les erreurs critiques de compilation dans `app/Http/Controllers/VehicleController.php` (accolades/validation/structure).
- [x] Étape 2: Corriger l’incohérence `destroy()` → `cancel()` dans `app/Http/Controllers/RentalController.php`.
- [x] Étape 3: Corriger les incohérences d’auth guard (`auth()` vs `auth('api')`) dans les contrôleurs concernés.
- [x] Étape 4: Corriger les imports manquants dans les modèles (ex: `User` dans `app/Models/Vehicle.php`).
- [x] Étape 5: Lancer `php -l`/vérif syntaxe sur les fichiers modifiés.

- [x] Étape 6: Exécuter `php artisan test` et corriger jusqu’au vert.

- [x] Étape 7: Exécuter `php artisan route:list` pour détecter routes invalides.

- [x] Étape 8: Rechercher d’autres patterns de bugs (incohérences de validations/relations) et corriger.

- [x] Étape 1-8: Corrigé (syntax + cohérences critiques) et vérifié.
- [x] Étape 9: Mettre à jour/ajouter tests “smoke” pour endpoints critiques (auth/vehicles/rentals/payments).



