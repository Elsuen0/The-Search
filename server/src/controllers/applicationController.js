const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createApplicationSchema, updateApplicationSchema } = require('../validators/applicationValidators');

exports.createApplication = async (req, res) => {
    const userId = req.userId;

    try {
        // 🆕 VALIDATION avec Zod (transforme automatiquement les dates)
        const validatedData = createApplicationSchema.parse(req.body);

        const application = await prisma.jobApplication.create({
            data: {
                ...validatedData,  // 🆕 Spread direct des données validées
                userId,
            },
        });

        res.status(201).json(application);
    } catch (error) {
        // Gestion des erreurs Zod
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Données invalides',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }

        console.error('Create application error:', error);
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
};

exports.getApplications = async (req, res) => {
    const userId = req.userId;
    const isKanban = req.query.view === 'kanban';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const where = { userId };
        if (req.query.status && req.query.status !== 'ALL') {
            where.status = req.query.status;
        }

        // Si Kanban, on prend tout (ou une limite très large si besoin)
        // Sinon on pagine
        const [applications, total] = await Promise.all([
            prisma.jobApplication.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                ...(isKanban ? {} : {
                    skip: (page - 1) * limit,
                    take: limit
                })
            }),
            prisma.jobApplication.count({ where })
        ]);

        if (isKanban) {
            return res.json({ data: applications });
        }

        res.json({
            data: applications,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getApplication = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const application = await prisma.jobApplication.findFirst({
            where: { id: parseInt(id), userId },
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateApplication = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        // 🆕 VALIDATION avec Zod
        const validatedData = updateApplicationSchema.parse(req.body);

        const existingApp = await prisma.jobApplication.findFirst({
            where: { id: parseInt(id), userId },
        });

        if (!existingApp) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const updatedApp = await prisma.jobApplication.update({
            where: { id: parseInt(id) },
            data: validatedData,
        });
        res.json(updatedApp);
    } catch (error) {
        // 🆕 Gestion des erreurs Zod
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Données invalides',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }

        console.error('Update application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteApplication = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const existingApp = await prisma.jobApplication.findFirst({
            where: { id: parseInt(id), userId },
        });

        if (!existingApp) {
            return res.status(404).json({ error: 'Application not found' });
        }

        await prisma.jobApplication.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Application deleted' });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
