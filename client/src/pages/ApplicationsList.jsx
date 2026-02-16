import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HiPlus, HiPencil, HiTrash, HiExternalLink, HiSearch, HiBell } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApplications = applications.filter(app => {
        const search = searchTerm.toLowerCase();
        return (
            app.company.toLowerCase().includes(search) ||
            app.position.toLowerCase().includes(search)
        );
    });

    useEffect(() => {
        fetchApplications(selectedStatus);
    }, [selectedStatus]);

    const fetchApplications = async (status = 'ALL') => {
        try {
            setLoading(true);
            const statusParam = status !== 'ALL' ? `&status=${status}` : '';
            const response = await api.get(`/applications?view=kanban${statusParam}`);

            // On adapte selon si ton backend renvoie toujours {data: [...]} ou directement le tableau
            const data = response.data.data || response.data;
            setApplications(data);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.delete(`/applications/${id}`);
                setApplications(applications.filter(app => app.id !== id));
                toast.success('Application deleted');
            } catch (error) {
                toast.error('Failed to delete application');
            }
        }
    };

    const statusColors = {
        'TO_APPLY': 'bg-slate-400',
        'APPLIED': 'bg-blue-400',
        'FOLLOWED_UP': 'bg-amber-400',
        'INTERVIEW': 'bg-purple-500',
        'OFFER_ACCEPTED': 'bg-emerald-500',
        'REJECTED': 'bg-rose-500'
    };

    const columnColors = {
        'TO_APPLY': 'border-t-slate-400',
        'APPLIED': 'border-t-blue-400',
        'FOLLOWED_UP': 'border-t-amber-400',
        'INTERVIEW': 'border-t-purple-500',
        'FINISH': 'border-t-emerald-500'
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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

    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de bord</h1>
                    <p className="text-gray-500 font-medium">Gérez vos {applications.length} candidatures en cours</p>
                </div>
                <Link to="/applications/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]">
                    <HiPlus className="text-xl" />
                    <span>Nouvelle candidature</span>
                </Link>
            </div>

            {/* Metrics and Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                            <span className="p-1.5 bg-gray-50 text-gray-400 rounded-xl"><HiSearch className="h-4 w-4" /></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                            <span className="text-[10px] text-gray-400 font-bold">Postes</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entretiens</p>
                            <span className="p-1.5 bg-green-50 text-green-600 rounded-xl"><HiBell className="h-4 w-4" /></span>
                        </div>
                        <p className="text-3xl font-black text-green-600">{stats.interview}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">À relancer</p>
                            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-xl"><HiBell className="h-4 w-4" /></span>
                        </div>
                        <p className="text-3xl font-black text-orange-600">{stats.pendingRelance}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Taux de succès</p>
                            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl"><HiExternalLink className="h-4 w-4" /></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-indigo-600">{stats.successRate}%</p>
                            <span className="text-[10px] text-gray-400 font-bold">vs total</span>
                        </div>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-between h-full">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 w-full">Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataChart}
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    cornerRadius={6}
                                    dataKey="value"
                                >
                                    {dataChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher une entreprise, un poste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3 border-none bg-gray-50/50 rounded-2xl text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-wider">Filtrer par:</span>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block w-full md:w-48 pl-4 pr-10 py-3 text-sm font-bold bg-gray-50/50 border-none rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="ALL">Tout les statuts</option>
                        <option value="TO_APPLY">À postuler</option>
                        <option value="APPLIED">Postulé</option>
                        <option value="FOLLOWED_UP">Relance</option>
                        <option value="INTERVIEW">Entretien</option>
                        <option value="REJECTED">Refusé</option>
                        <option value="OFFER_ACCEPTED">Offre acceptée</option>
                    </select>
                </div>
            </div>

            {/* Grille Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start pb-10">
                {[
                    { title: 'À postuler', status: 'TO_APPLY' },
                    { title: 'Postulé', status: 'APPLIED' },
                    { title: 'Relance', status: 'FOLLOWED_UP' },
                    { title: 'Entretien', status: 'INTERVIEW' },
                    { title: 'Terminé', status: 'FINISH' }
                ].map((column) => {
                    const columnApps = filteredApplications.filter(app =>
                        app.status === column.status ||
                        (column.status === 'FINISH' && ['REJECTED', 'OFFER_ACCEPTED'].includes(app.status))
                    );

                    return (
                        <div key={column.status} className={`bg-gray-100/50 rounded-lg border border-gray-200 border-t-4 ${columnColors[column.status]} flex flex-col min-h-[500px]`}>
                            {/* Header de colonne avec Compteur */}
                            <div className="p-3 border-b border-gray-200 bg-white rounded-t-sm flex justify-between items-center shadow-sm">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    {column.title}
                                </h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {columnApps.length}
                                </span>
                            </div>

                            {/* Zone des cartes avec effet de chevauchement */}

                            <div className="p-2 flex flex-col -space-y-8 pb-20">
                                {columnApps.map((app, index) => {
                                    // --- LOGIQUE DE CALCUL ---
                                    const lastDate = new Date(app.updatedAt || app.createdAt);
                                    const daysSinceUpdate = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
                                    // On cible uniquement les candidatures en attente (APPLIED) de plus de 7 jours
                                    const isStale = daysSinceUpdate >= 7 && app.status === 'APPLIED';

                                    return (
                                        <div
                                            key={app.id}
                                            style={{ zIndex: index }}
                                            className="group relative bg-white p-5 min-h-[160px] flex flex-col justify-between rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-6 hover:z-[100] cursor-pointer"
                                        >
                                            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${statusColors[app.status] || 'bg-indigo-400'}`} />

                                            <div className="pl-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 uppercase tracking-wider">
                                                        {app.contractType || 'CDI'}
                                                    </span>
                                                    <span className={`text-[10px] uppercase font-semibold ${isStale ? 'text-orange-600' : 'text-gray-400'}`}>
                                                        {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '-'}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                    {app.company}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate mb-1 italic">
                                                    {app.position}
                                                </p>

                                                {/* --- LE BADGE D'ALERTE --- */}
                                                {isStale && (
                                                    <div className="mb-3 flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 animate-pulse">
                                                        <HiBell className="h-3 w-3" />
                                                        RELANCE (J+{daysSinceUpdate})
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                    <div>
                                                        {app.offerUrl && (
                                                            <a href={app.offerUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors">
                                                                <HiExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link to={`/applications/${app.id}/edit`} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600">
                                                            <HiPencil className="h-4 w-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(app.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600">
                                                            <HiTrash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationsList;