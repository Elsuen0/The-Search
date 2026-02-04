# 🎯 Job Tracker SaaS

Application fullstack de suivi de candidatures pour freelances et chercheurs d'emploi.

## 🚀 Stack technique

- **Frontend** : React, Tailwind CSS, React Router
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL, Prisma ORM
- **Auth** : JWT
- **Validation** : Zod
- **Deployment** : Vercel (frontend) + Railway (backend)

## ✨ Fonctionnalités

- ✅ Authentification complète (register/login/JWT)
- ✅ CRUD candidatures avec validation
- ✅ Pagination des résultats
- ✅ Système de statuts (To Apply, Applied, Interview, etc.)
- ✅ Upload de fichiers (CV, lettres de motivation)
- 🚧 Dashboard avec statistiques (en cours)
- 🚧 Filtres et recherche avancée (en cours)
- 🚧 Templates d'emails de relance (prévu)

## 🛠️ Installation locale

### Backend
```bash
cd server
npm install
# Configurer .env avec DATABASE_URL et JWT_SECRET
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 📸 Screenshots

Prochainement

## 🎓 Projet réalisé pour

Apprentissage fullstack et portfolio professionnel.

---

⭐ **Star ce repo si tu le trouves utile !**