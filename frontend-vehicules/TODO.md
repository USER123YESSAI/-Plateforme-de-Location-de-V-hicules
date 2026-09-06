# TODO

## Objectif
Corriger l’erreur SWC sur Windows : `Failed to load SWC binary for win32/x64 ... not a valid Win32 application`.

## Étapes
- [x] Mettre à jour `next` (ex: vers 15.x comme proposé) dans `package.json`.
- [x] Mettre à jour `eslint-config-next` pour correspondre à la nouvelle version Next.
- [x] Nettoyer : `node_modules`, `package-lock.json`, `.next`.
- [x] Refaire `npm install`.
- [x] Relancer `npm run dev` et vérifier que le serveur démarre.
- [x] (Si échec) activer un mode workaround/alternative SWC et fournir logs (Fichier `.babelrc` ajouté).

