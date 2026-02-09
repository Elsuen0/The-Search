import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HiBriefcase, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 text-${color}-600`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-lg font-medium text-gray-900">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, byStatus: {} });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // On récupère les deux types d'infos
                const [statsRes, appsRes] = await Promise.all([
                    api.get('/stats'),
                    api.get('/applications?limit=5')
                ]);

                // On met à jour les deux états séparément
                setStats(statsRes.data); // Met à jour les compteurs
                setApplications(appsRes.data.data); // Met à jour la liste
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Applications"
                    value={stats.total}
                    icon={HiBriefcase}
                    color="indigo"
                />
                <StatCard
                    title="Interviews"
                    value={stats.byStatus['INTERVIEW'] || 0}
                    icon={HiClock}
                    color="yellow"
                />
                <StatCard
                    title="Offers"
                    value={stats.byStatus['OFFER_ACCEPTED'] || 0}
                    icon={HiCheckCircle}
                    color="green"
                />
                <StatCard
                    title="Rejections"
                    value={stats.byStatus['REJECTED'] || 0}
                    icon={HiXCircle}
                    color="red"
                />
            </div>

            <div className="mt-8">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h2>
                <div className="mt-4 bg-white shadow rounded-lg">
                    {applications.map(app => (
                        <div key={app.id} className="p-4 border-b">
                            {app.company} - {app.position}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
