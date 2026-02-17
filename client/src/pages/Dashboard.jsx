// --- 1. IMPORTS ---
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HiSearch, HiBell, HiExternalLink, HiBriefcase } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

// --- 2. COMPOSANT DASHBOARD ---
const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // -- CHARGEMENT DES DONNÉES --
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Pour le dashboard, on récupère toutes les candidatures pour calculer les stats
                const response = await api.get('/applications?view=kanban');
                const data = response.data.data || response.data;
                setApplications(data);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // -- PRÉPARATION DES DONNÉES (Stats & Charts) --
    const stats = {
        total: applications.length,
        interview: applications.filter(app => app.status === 'INTERVIEW').length,
        pendingRelance: applications.filter(app => {
            const lastDate = new Date(app.updatedAt || app.createdAt);
            const days = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            return days >= 7 && app.status === 'APPLIED';
        }).length,
        successRate: applications.length > 0
            ? Math.round((applications.filter(app => ['INTERVIEW', 'OFFER_ACCEPTED'].includes(app.status)).length / applications.length) * 100)
            : 0
    };

    const dataChart = [
        { name: 'À postuler', value: applications.filter(app => app.status === 'TO_APPLY').length, fill: '#94A3B8' },
        { name: 'Postulé', value: applications.filter(app => app.status === 'APPLIED').length, fill: '#60A5FA' },
        { name: 'Relance', value: applications.filter(app => app.status === 'FOLLOWED_UP').length, fill: '#FBBF24' },
        { name: 'Entretien', value: applications.filter(app => app.status === 'INTERVIEW').length, fill: '#A855F7' },
        { name: 'Offre', value: applications.filter(app => app.status === 'OFFER_ACCEPTED').length, fill: '#10B981' },
        { name: 'Refusé', value: applications.filter(app => app.status === 'REJECTED').length, fill: '#F43F5E' }
    ].filter(item => item.value > 0);

    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short'
        });

        const count = applications.filter(app => {
            const appDate = new Date(app.appliedDate || app.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short'
            });
            return appDate === dateStr;
        }).length;

        return {
            name: dateStr,
            candidatures: count
        };
    }).reverse();

    // --- 3. RENDU DE L'INTERFACE ---
    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vue d'ensemble</h1>
                <p className="text-gray-500 font-medium">Analyse de vos performances de recherche</p>
            </div>

            {/* SECTION STATS & GRAPHIQUES */}
            <div className="flex flex-col gap-8 mb-12">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                            <span className="p-1.5 bg-gray-50 text-gray-400 rounded-xl"><HiBriefcase className="h-4 w-4" /></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                            <span className="text-[10px] text-gray-400 font-bold italic">postes</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entretiens</p>
                            <span className="p-1.5 bg-green-50 text-green-600 rounded-xl"><HiBell className="h-4 w-4" /></span>
                        </div>
                        <p className="text-3xl font-black text-green-600">{stats.interview}</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">À relancer</p>
                            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-xl"><HiBell className="h-4 w-4" /></span>
                        </div>
                        <p className="text-3xl font-black text-orange-600">{stats.pendingRelance}</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Succès</p>
                            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl"><HiExternalLink className="h-4 w-4" /></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-indigo-600">{stats.successRate}%</p>
                            <span className="text-[10px] text-gray-400 font-bold italic">taux</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* DONUTS */}
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 w-full text-center">Distribution des statuts</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataChart}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={6}
                                        cornerRadius={12}
                                        dataKey="value"
                                    >
                                        {dataChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{ paddingTop: '30px', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* COURBE */}
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 w-full text-center">Candidatures envoyées</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={last7Days}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                                        dy={15}
                                    />
                                    <YAxis hide={true} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                                        itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="candidatures"
                                        stroke="#6366f1"
                                        strokeWidth={5}
                                        dot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT APPLICATIONS */}
            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Activités récentes</h2>
                    <Link to="/applications" className="text-indigo-600 font-bold text-sm hover:underline">Voir tout →</Link>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {applications.slice(0, 5).map(app => (
                            <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                        {app.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{app.company}</h4>
                                        <p className="text-xs text-gray-500">{app.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                                        {new Date(app.updatedAt || app.createdAt).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                        app.status === 'OFFER_ACCEPTED' ? 'bg-emerald-50 text-emerald-600' :
                                            app.status === 'INTERVIEW' ? 'bg-purple-50 text-purple-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
