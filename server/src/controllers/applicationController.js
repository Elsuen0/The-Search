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

    // 🆕 Récupère page et limit depuis la query string
    const page = parseInt(req.query.page) || 1;  // Par défaut page 1
    const limit = parseInt(req.query.limit) || 10; // Par défaut 10 par page

    // 🆕 Calcul du skip (combien on saute)
    const skip = (page - 1) * limit;
    // Exemple: page 1 → skip 0, page 2 → skip 10, page 3 → skip 20

    try {
        // 🆕 Compte le total de candidatures (pour savoir combien de pages)
        const totalCount = await prisma.jobApplication.count({
            where: { userId },
        });

        // 🆕 Récupère seulement la page demandée
        const applications = await prisma.jobApplication.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: skip,      // Saute les N premières
            take: limit,     // Prend seulement 10
        });

        // 🆕 Retourne les données + métadonnées de pagination
        res.json({
            data: applications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Internal server error' });
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
            data: {
                company: validatedData.company,
                position: validatedData.position,
                status: validatedData.status,
                // Only update dates if they are provided in the validated data (could be null or string)
                // If undefined (not present), Prisma ignores it.
                appliedDate: validatedData.appliedDate !== undefined
                    ? (validatedData.appliedDate ? new Date(validatedData.appliedDate) : null)
                    : undefined,
                reminderDate: validatedData.reminderDate !== undefined
                    ? (validatedData.reminderDate ? new Date(validatedData.reminderDate) : null)
                    : undefined,
                notes: validatedData.notes,
            },
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
