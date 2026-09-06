#!/bin/bash
set -e

# Configurer le port d'écoute Apache pour Render ($PORT)
RENDER_PORT=${PORT:-8000}
echo "Configuration d'Apache pour écouter sur le port ${RENDER_PORT}..."
sed -i "s/Listen 80/Listen ${RENDER_PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${RENDER_PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Création du lien symbolique de stockage pour les images véhicules
php artisan storage:link || true

# Exécution des migrations sur la base MySQL (TiDB Cloud)
echo "Exécution des migrations de base de données..."
php artisan migrate --force || echo "Avertissement: Les migrations ont rencontré un problème ou sont déjà à jour."

# Initialisation des données de base (Seeders) si nécessaire
echo "Vérification et insertion des données initiales (Seeders)..."
php artisan db:seed --force || echo "Avertissement: Les seeders ont déjà été exécutés ou ignorés."

# Mise en cache pour les performances de production
echo "Mise en cache de la configuration et des routes..."
php artisan config:cache || true
php artisan route:cache || true
# Garantir que www-data possède toujours les droits d'écriture sur SQLite et storage
chown -R www-data:www-data /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache || true

echo "Démarrage d'Apache sur le port ${RENDER_PORT}..."
exec apache2-foreground
