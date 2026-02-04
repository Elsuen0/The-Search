const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
    'Netflix', 'Tesla', 'Airbnb', 'Stripe', 'Shopify',
    'Adobe', 'Salesforce', 'Oracle', 'SAP', 'IBM',
    'Spotify', 'Uber', 'Twitter', 'LinkedIn', 'GitHub'
];

const positions = [
    'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
    'DevOps Engineer', 'Data Engineer', 'Product Manager',
    'UI/UX Designer', 'Software Engineer', 'Tech Lead',
    'QA Engineer', 'Mobile Developer', 'Cloud Architect'
];

const statuses = [
    'TO_APPLY', 'APPLIED', 'FOLLOWED_UP',
    'INTERVIEW', 'REJECTED', 'OFFER_ACCEPTED'
];

const notes = [
    'Entreprise très intéressante, bonne culture',
    'Salaire attractif, remote possible',
    'Entretien technique prévu la semaine prochaine',
    'Réponse négative reçue',
    'Offre acceptée ! 🎉',
    'En attente de retour',
    null
];

async function main() {
    // Récupère le premier utilisateur (ou crée-en un si besoin)
    let user = await prisma.user.findFirst();

    if (!user) {
        console.log('Aucun utilisateur trouvé. Crée-toi un compte d\'abord !');
        return;
    }

    console.log(`🌱 Seed pour l'utilisateur: ${user.email}`);

    // Génère 25 candidatures aléatoires
    for (let i = 0; i < 25; i++) {
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];

        // Date aléatoire dans les 30 derniers jours
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

        await prisma.jobApplication.create({
            data: {
                company: randomCompany,
                position: randomPosition,
                status: randomStatus,
                appliedDate: randomStatus !== 'TO_APPLY' ? randomDate : null,
                reminderDate: Math.random() > 0.5 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
                notes: randomNote,
                userId: user.id,
            },
        });

        console.log(`✅ Candidature ${i + 1}/25 créée`);
    }

    console.log('🎉 Seed terminé !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });