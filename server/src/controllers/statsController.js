const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
    const userId = req.userId;

    try {
        const totalApplications = await prisma.jobApplication.count({
            where: { userId },
        });

        const statusCounts = await prisma.jobApplication.groupBy({
            by: ['status'],
            where: { userId },
            _count: {
                status: true,
            },
        });

        // Format for easier frontend consumption
        const stats = statusCounts.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});

        res.json({
            total: totalApplications,
            byStatus: stats,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
