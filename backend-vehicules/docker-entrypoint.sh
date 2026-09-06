#!/bin/bash
set -e

# Configurer le port d'écoute Apache pour Render ($PORT)
RENDER_PORT=${PORT:-8000}
echo "Configuration d'Apache pour écouter sur le port ${RENDER_PORT}..."
sed -i "s/Listen 80/Listen ${RENDER_PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${RENDER_PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Création du lien symbolique de stockage pour les images véhicules
php artisan storage:link || true

# Exécution des migrations sur la base MySQL (Aiven)
echo "Exécution des migrations de base de données..."
php artisan migrate --force || echo "Avertissement: Les migrations ont rencontré un problème ou sont déjà à jour."

# Mise en cache pour les performances de production
echo "Mise en cache de la configuration et des routes..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Démarrage d'Apache sur le port ${RENDER_PORT}..."
exec apache2-foreground
