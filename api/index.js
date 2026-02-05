// Point d'entrée pour Vercel Serverless Functions
require('dotenv').config();
const app = require('../server/src/app');

// Prisma sera initialisé automatiquement par @prisma/client
// Pas besoin de app.listen() ici, Vercel gère le serveur

module.exports = app;