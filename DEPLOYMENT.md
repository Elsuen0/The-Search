# The Search - Déploiement sur Vercel

## 📋 Configuration requise

### Variables d'environnement Vercel

Avant de déployer, configurez ces variables d'environnement dans votre projet Vercel :

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
JWT_SECRET=votre_secret_jwt_super_securise
NODE_ENV=production
```

## 🚀 Déploiement

### 1. Installation de Vercel CLI (optionnel)

```bash
npm install -g vercel
```

### 2. Déploiement via CLI

```bash
vercel
```

### 3. Déploiement via GitHub

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement la configuration
3. Ajoutez les variables d'environnement dans les settings
4. Déployez !

## 🔧 Structure du projet

```
.
├── api/
│   └── index.js          # Point d'entrée Vercel pour le backend
├── client/
│   ├── src/
│   │   └── services/
│   │       └── api.js    # Configuration API (URL relative)
│   └── vite.config.js    # Proxy pour le dev local
├── server/
│   ├── src/
│   │   ├── app.js        # Application Express
│   │   └── server.js     # Serveur local uniquement
│   └── prisma/
│       └── schema.prisma
├── package.json          # Dependencies backend
└── vercel.json           # Configuration Vercel

```

## 🌐 URLs en production

- **Frontend** : `https://votre-app.vercel.app`
- **API** : `https://votre-app.vercel.app/api/*`

## 🛠️ Développement local

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Le proxy Vite redirigera automatiquement `/api` vers `http://localhost:3000`.

## 📝 Notes importantes

1. **CORS** : Configuré pour accepter localhost en dev et *.vercel.app en production
2. **API URLs** : Utilise des URLs relatives (`/api`) pour fonctionner en dev et prod
3. **Prisma** : Généré automatiquement lors du build Vercel
4. **Base de données** : Assurez-vous que votre DB est accessible depuis Vercel

## 🐛 Troubleshooting

### Erreur de connexion à la base de données

Vérifiez que :
- `DATABASE_URL` est correctement configurée dans Vercel
- Votre base de données autorise les connexions depuis Vercel
- Les migrations Prisma sont à jour

### Erreur CORS

Si vous avez des erreurs CORS :
- Vérifiez que votre domaine Vercel est dans la liste des origines autorisées
- Assurez-vous que `credentials: true` est configuré côté client si nécessaire

### Build échoue

- Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez que le script `vercel-build` s'exécute correctement
