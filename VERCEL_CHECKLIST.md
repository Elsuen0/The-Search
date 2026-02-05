# ✅ Checklist de déploiement Vercel

## 🎯 Modifications effectuées

### 1. ✅ URLs Relatives dans le Frontend
**Fichier** : `client/src/services/api.js`
- ❌ Avant : `baseURL: 'http://localhost:3000/api'`
- ✅ Après : `baseURL: '/api'`

### 2. ✅ Proxy Vite pour le développement
**Fichier** : `client/vite.config.js`
- Ajout d'un proxy qui redirige `/api` → `http://localhost:3000`
- Fonctionne uniquement en mode développement
- En production, `/api` pointe vers le backend Vercel

### 3. ✅ Configuration CORS flexible
**Fichier** : `server/src/app.js`
- Autorise `localhost:5173` (Vite dev)
- Autorise `localhost:3000` (Backend local)
- Autorise tous les domaines `*.vercel.app`
- Support de `credentials: true` pour les cookies/auth

### 4. ✅ Point d'entrée Vercel
**Fichier** : `api/index.js`
- Charge `dotenv` pour les variables d'environnement
- Exporte l'app Express sans `app.listen()`
- Vercel gère le serveur automatiquement

### 5. ✅ Configuration Vercel
**Fichier** : `vercel.json`
- Build du frontend avec `@vercel/static-build`
- Build du backend avec `@vercel/node`
- Routes :
  - `/api/*` → Backend serverless
  - `/*` → Frontend statique

### 6. ✅ Scripts de build
**Fichier** : `package.json`
- `vercel-build` : Génère Prisma + Build du client
- Exécuté automatiquement par Vercel

### 7. ✅ Fichiers de configuration
- `.vercelignore` : Ignore les fichiers inutiles
- `DEPLOYMENT.md` : Documentation complète

## 🚀 Prochaines étapes

### Sur Vercel Dashboard :

1. **Créer un nouveau projet**
   - Connecter votre repository Git
   - Vercel détectera automatiquement la configuration

2. **Configurer les variables d'environnement**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=votre_secret_super_securise
   NODE_ENV=production
   ```

3. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel exécutera automatiquement `vercel-build`

### Base de données :

Assurez-vous que votre base de données PostgreSQL :
- ✅ Est accessible depuis Internet
- ✅ Autorise les connexions depuis Vercel
- ✅ A les migrations Prisma appliquées

### Test en local :

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Ouvrez `http://localhost:5173` - Le proxy redirigera `/api` vers le backend local.

## 🔍 Vérifications

- ✅ Pas de `localhost` en dur dans le code frontend
- ✅ CORS configuré pour dev et production
- ✅ `app.js` exporte l'app sans `listen()`
- ✅ `server.js` utilisé uniquement en dev
- ✅ Proxy Vite configuré pour le dev local
- ✅ Variables d'environnement documentées
- ✅ Scripts de build configurés

## 📊 Architecture

```
Production (Vercel)
┌─────────────────────────────────────┐
│  https://votre-app.vercel.app       │
├─────────────────────────────────────┤
│                                     │
│  GET /          → Frontend (React)  │
│  GET /about     → Frontend (React)  │
│  POST /api/auth → Backend (Express) │
│  GET /api/stats → Backend (Express) │
│                                     │
└─────────────────────────────────────┘

Développement Local
┌──────────────────┐      ┌──────────────────┐
│  localhost:5173  │ ───► │  localhost:3000  │
│  Frontend (Vite) │ /api │  Backend (Node)  │
│  + Proxy         │      │                  │
└──────────────────┘      └──────────────────┘
```

## 🎉 C'est prêt !

Votre application est maintenant configurée pour :
- ✅ Fonctionner en développement local avec le proxy
- ✅ Se déployer sur Vercel sans modification
- ✅ Communiquer via le même domaine en production
