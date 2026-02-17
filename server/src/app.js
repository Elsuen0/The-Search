// --- 1. IMPORTS & DEPENDANCES ---
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const morgan = require('morgan'); 

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// --- 2. CONFIGURATION & MIDDLEWARES ---
app.use(helmet());

// Configuration CORS flexible pour dev et production
const corsOptions = {
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origin (comme les apps mobiles ou curl)
        if (!origin) return callback(null, true);

        // Liste des origines autorisées
        const allowedOrigins = [
            'http://localhost:5173', // Vite dev server
            'http://localhost:3000', // Backend local
            /\.vercel\.app$/, // Tous les domaines Vercel
        ];

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// --- 3. DÉFINITION DES ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'SaaS Job Tracker API is running' });
});

module.exports = app;
