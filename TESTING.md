# 🧪 Tests pré-déploiement

## ✅ Checklist de tests locaux

Avant de déployer sur Vercel, vérifiez que tout fonctionne en local :

### 1. Backend (localhost:3000)

```bash
cd server
npm run dev
```

**Tests à effectuer :**
- [ ] Le serveur démarre sans erreur
- [ ] Connexion à la base de données réussie
- [ ] `http://localhost:3000/` retourne le message API
- [ ] Les routes API répondent correctement

**Tester les endpoints :**
```bash
# Test de santé
curl http://localhost:3000/

# Test d'inscription (exemple)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

### 2. Frontend (localhost:5173)

```bash
cd client
npm run dev
```

**Tests à effectuer :**
- [ ] L'application se charge sans erreur
- [ ] Le proxy Vite fonctionne (vérifier dans DevTools Network)
- [ ] Les appels API utilisent `/api` (pas `localhost:3000`)
- [ ] L'authentification fonctionne
- [ ] Les formulaires soumettent correctement

**Vérifier dans DevTools :**
1. Ouvrir les DevTools (F12)
2. Onglet Network
3. Faire une action (login, créer une application, etc.)
4. Vérifier que les requêtes vont vers `/api/...` et non `localhost:3000`

### 3. Variables d'environnement

**Serveur (`server/.env`) :**
- [ ] `DATABASE_URL` est définie
- [ ] `JWT_SECRET` est définie
- [ ] La connexion à la DB fonctionne

**Client (optionnel) :**
- [ ] Aucune variable sensible dans le code frontend
- [ ] Pas de clés API exposées

### 4. Build de production

**Tester le build du client :**
```bash
cd client
npm run build
```

**Vérifications :**
- [ ] Le build se termine sans erreur
- [ ] Le dossier `dist/` est créé
- [ ] Pas de warnings critiques

**Tester le build complet (depuis la racine) :**
```bash
npm run build
```

- [ ] Prisma génère les types
- [ ] Le client build correctement

### 5. CORS

**Tester depuis le frontend :**
- [ ] Les requêtes API passent sans erreur CORS
- [ ] Les cookies/tokens sont envoyés correctement

**Vérifier dans le code :**
- [ ] `server/src/app.js` a la config CORS
- [ ] Les origines autorisées incluent localhost ET vercel.app

### 6. Sécurité

**Vérifications de sécurité :**
- [ ] Pas de secrets dans le code (utilisez `.env`)
- [ ] `.env` est dans `.gitignore`
- [ ] `JWT_SECRET` est fort et unique
- [ ] Helmet est activé (`server/src/app.js`)

### 7. Git

**Avant de commit :**
- [ ] `.env` n'est PAS dans Git
- [ ] `node_modules/` n'est PAS dans Git
- [ ] `.vercel/` n'est PAS dans Git
- [ ] Tous les fichiers importants sont commités

```bash
git status
git add .
git commit -m "feat: Configuration pour déploiement Vercel"
git push
```

## 🚀 Tests post-déploiement Vercel

Une fois déployé sur Vercel :

### 1. Vérifier le build

- [ ] Le build Vercel se termine avec succès
- [ ] Pas d'erreurs dans les logs
- [ ] Prisma génère correctement

### 2. Tester l'application en production

**Frontend :**
- [ ] `https://votre-app.vercel.app` se charge
- [ ] Pas d'erreurs dans la console
- [ ] Le design s'affiche correctement

**Backend :**
- [ ] `https://votre-app.vercel.app/api` répond
- [ ] Les routes API fonctionnent

**Test complet :**
- [ ] Inscription d'un nouvel utilisateur
- [ ] Connexion
- [ ] Création d'une application
- [ ] Lecture des données
- [ ] Mise à jour
- [ ] Suppression

### 3. Vérifier les variables d'environnement

Dans Vercel Dashboard :
- [ ] `DATABASE_URL` est définie
- [ ] `JWT_SECRET` est définie
- [ ] `NODE_ENV=production` est définie

### 4. Tester la base de données

- [ ] Les données sont persistées
- [ ] Les migrations Prisma sont appliquées
- [ ] Pas d'erreurs de connexion

### 5. Performance

- [ ] Temps de chargement < 3 secondes
- [ ] Les API répondent rapidement
- [ ] Pas de timeout

### 6. Erreurs courantes

**Si le frontend ne charge pas :**
- Vérifier les logs de build Vercel
- Vérifier que `client/dist/` est généré
- Vérifier `vercel.json` routes

**Si les API ne répondent pas :**
- Vérifier les logs de fonction Vercel
- Vérifier `DATABASE_URL` dans les env vars
- Vérifier que Prisma est généré

**Si erreur CORS :**
- Vérifier `server/src/app.js` CORS config
- Vérifier que le domaine Vercel est autorisé

## 📊 Monitoring

Après le déploiement, surveillez :
- [ ] Logs Vercel pour les erreurs
- [ ] Métriques de performance
- [ ] Utilisation de la base de données

## ✅ Tout est OK ?

Si tous les tests passent, votre application est prête pour la production ! 🎉

**Prochaines étapes :**
1. Configurer un domaine personnalisé (optionnel)
2. Mettre en place des analytics
3. Configurer des alertes d'erreur (Sentry, etc.)
4. Planifier les backups de la base de données
