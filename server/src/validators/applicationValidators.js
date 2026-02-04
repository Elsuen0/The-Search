const { z } = require('zod');

// Validation pour créer une candidature
const createApplicationSchema = z.object({
    company: z.string()
        .min(1, "Le nom de l'entreprise est requis")
        .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"),

    position: z.string()
        .min(1, "Le poste est requis")
        .max(100, "Le poste ne peut pas dépasser 100 caractères"),

    status: z.enum(['TO_APPLY', 'APPLIED', 'FOLLOWED_UP', 'INTERVIEW', 'REJECTED', 'OFFER_ACCEPTED'])
        .optional()
        .default('TO_APPLY'),

    // 🆕 Accepte string OU null, et transforme en Date ou null
    appliedDate: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.null()
    ]).optional().nullable(),

    reminderDate: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.null()
    ]).optional().nullable(),

    notes: z.string()
        .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
        .optional()
        .nullable(),
});

// Validation pour modifier une candidature
const updateApplicationSchema = createApplicationSchema.partial();

module.exports = {
    createApplicationSchema,
    updateApplicationSchema,
};