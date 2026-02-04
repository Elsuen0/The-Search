const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const morgan = require('morgan'); 

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'SaaS Job Tracker API is running' });
});

module.exports = app;
