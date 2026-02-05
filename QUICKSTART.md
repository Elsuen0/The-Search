# 🚀 Guide de démarrage rapide - Déploiement Vercel

## ✅ Toutes les modifications sont terminées !

Votre application est maintenant prête pour Vercel. Voici ce qui a été fait :

### 📝 Modifications effectuées

1. **Frontend** (`client/src/services/api.js`)
   - URL changée de `http://localhost:3000/api` → `/api`

2. **Proxy Vite** (`client/vite.config.js`)
   - Proxy configuré pour rediriger `/api` vers `localhost:3000` en dev

3. **CORS** (`server/src/app.js`)
   - Autorise localhost ET *.vercel.app

4. **Point d'entrée Vercel** (`api/index.js`)
   - Exporte l'app Express pour Vercel Serverless

5. **Configuration Vercel** (`vercel.json`)
   - Builds et routes configurés

## 🎯 Déploiement sur Vercel (3 étapes)

### Étape 1 : Préparer la base de données

Assurez-vous d'avoir une base PostgreSQL accessible depuis Internet.
Options recommandées :
- [Neon](https://neon.tech) - Gratuit, serverless
- [Supabase](https://supabase.com) - Gratuit avec PostgreSQL
- [Railway](https://railway.app) - Facile à configurer

### Étape 2 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez votre repository Git
4. Vercel détectera automatiquement la configuration

### Étape 3 : Configurer les variables d'environnement

Dans les settings du projet Vercel, ajoutez :

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
JWT_SECRET=votre_secret_super_securise
NODE_ENV=production
```

**C'est tout !** Cliquez sur Deploy 🎉

## 🧪 Tester en local

Vos serveurs dev sont déjà en cours d'exécution. Testez que tout fonctionne :

1. Ouvrez `http://localhost:5173`
2. Essayez de vous connecter ou créer un compte
3. Le proxy Vite redirigera automatiquement `/api` vers `localhost:3000`

## 📚 Documentation

- `VERCEL_CHECKLIST.md` - Liste complète des modifications
- `DEPLOYMENT.md` - Guide détaillé de déploiement
- `.env.example` - Variables d'environnement nécessaires

## ❓ Problèmes courants

### Le frontend ne peut pas contacter le backend en local
- Vérifiez que le serveur backend tourne sur le port 3000
- Vérifiez le proxy dans `client/vite.config.js`

### Erreur CORS en production
- Vérifiez que votre domaine Vercel est autorisé dans `server/src/app.js`
- Les domaines `*.vercel.app` sont déjà autorisés

### Build échoue sur Vercel
- Vérifiez les logs de build
- Assurez-vous que `DATABASE_URL` est configurée
- Vérifiez que Prisma peut se connecter à la DB

## 🎊 Félicitations !

Votre application est prête pour la production ! 🚀
