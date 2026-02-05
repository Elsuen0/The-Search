# 🛠️ Commandes utiles

## 📋 Commandes de développement

### Démarrer l'application en local

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Installer les dépendances

```bash
# Racine (pour Vercel)
npm install

# Backend
cd server
npm install

# Frontend
cd client
npm install
```

## 🗄️ Commandes Prisma

### Générer le client Prisma

```bash
cd server
npx prisma generate
```

### Créer une migration

```bash
cd server
npx prisma migrate dev --name nom_de_la_migration
```

### Appliquer les migrations

```bash
cd server
npx prisma migrate deploy
```

### Ouvrir Prisma Studio (interface graphique)

```bash
cd server
npx prisma studio
```

### Reset la base de données (⚠️ ATTENTION : Supprime toutes les données)

```bash
cd server
npx prisma migrate reset
```

### Seed la base de données

```bash
cd server
npm run seed
```

## 🏗️ Commandes de build

### Build du frontend uniquement

```bash
cd client
npm run build
```

### Build complet (Prisma + Frontend)

```bash
# Depuis la racine
npm run build
```

### Preview du build frontend

```bash
cd client
npm run preview
```

## 🚀 Commandes Vercel

### Installer Vercel CLI

```bash
npm install -g vercel
```

### Login Vercel

```bash
vercel login
```

### Déployer sur Vercel (preview)

```bash
vercel
```

### Déployer en production

```bash
vercel --prod
```

### Voir les logs

```bash
vercel logs
```

### Lister les déploiements

```bash
vercel ls
```

### Ouvrir le dashboard Vercel

```bash
vercel open
```

## 🔧 Commandes Git

### Commit et push

```bash
git add .
git commit -m "feat: Configuration pour Vercel"
git push origin main
```

### Vérifier le statut

```bash
git status
```

### Voir les fichiers ignorés

```bash
git status --ignored
```

## 🧪 Commandes de test

### Tester la connexion à la DB

```bash
cd server
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e))"
```

### Tester une route API (avec curl)

```bash
# Test de santé
curl http://localhost:3000/

# Test d'inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Test de login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Vérifier les ports utilisés

```bash
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Tuer un processus sur un port
# Trouver le PID avec netstat, puis :
taskkill /PID <PID> /F
```

## 📦 Commandes npm

### Vérifier les dépendances obsolètes

```bash
npm outdated
```

### Mettre à jour les dépendances

```bash
npm update
```

### Nettoyer le cache npm

```bash
npm cache clean --force
```

### Réinstaller les node_modules

```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json
npm install
```

## 🔍 Commandes de débogage

### Vérifier la version de Node

```bash
node --version
```

### Vérifier la version de npm

```bash
npm --version
```

### Vérifier les variables d'environnement

```bash
# Windows PowerShell
Get-ChildItem Env:

# Vérifier une variable spécifique
echo $env:DATABASE_URL
```

### Afficher les logs du serveur

```bash
cd server
npm run dev 2>&1 | tee server.log
```

## 🧹 Commandes de nettoyage

### Nettoyer les builds

```bash
# Frontend
cd client
rm -rf dist

# Tout nettoyer
cd ..
rm -rf client/dist server/node_modules client/node_modules node_modules
```

### Nettoyer Prisma

```bash
cd server
rm -rf node_modules/.prisma
npx prisma generate
```

## 📊 Commandes d'analyse

### Analyser la taille du bundle

```bash
cd client
npm run build
npx vite-bundle-visualizer
```

### Linter le code

```bash
cd client
npm run lint
```

## 🔐 Commandes de sécurité

### Vérifier les vulnérabilités

```bash
npm audit
```

### Corriger les vulnérabilités automatiquement

```bash
npm audit fix
```

### Corriger avec force (⚠️ peut casser des choses)

```bash
npm audit fix --force
```

## 💡 Commandes utiles

### Générer un secret JWT

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Créer un fichier .env depuis .env.example

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Puis éditer .env avec vos valeurs
```

### Vérifier que le proxy Vite fonctionne

```bash
# Démarrer le frontend
cd client
npm run dev

# Dans un autre terminal, vérifier les logs
# Les requêtes /api doivent être redirigées vers localhost:3000
```

## 🎯 Raccourcis utiles

### Tout démarrer en une commande (nécessite concurrently)

```bash
# Installer concurrently
npm install -g concurrently

# Créer un script dans package.json (racine)
# "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""

# Puis lancer
npm run dev
```

### Build et test local

```bash
npm run build && cd client && npm run preview
```

## 📝 Notes

- Les commandes `cd` sont pour naviguer dans les dossiers
- Remplacez `<PID>` par le numéro de processus réel
- Les commandes avec `⚠️` peuvent être destructives
- Toujours faire un backup avant les commandes de reset
