// --- 1. IMPORTS ---
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HiPlus, HiPencil, HiTrash, HiExternalLink, HiSearch, HiBell } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- 2. COMPOSANT PRINCIPAL ---
const ApplicationsList = () => {
    // -- ÉTATS LOCAUX --
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // -- LOGIQUE DE FILTRAGE --
    const filteredApplications = applications.filter(app => {
        const search = searchTerm.toLowerCase();
        return (
            app.company.toLowerCase().includes(search) ||
            app.position.toLowerCase().includes(search)
        );
    });

    // -- EFFETS (Chargement initial) --
    useEffect(() => {
        fetchApplications(selectedStatus);
    }, [selectedStatus]);

    // -- ACTIONS & APPELS API --
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

    // -- CONFIGURATION VISUELLE --
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

    // --- 3. RENDU DE L'INTERFACE ---
    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            {/* EN-TÊTE : Titre et Bouton Ajout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Suivi des candidatures</h1>
                    <p className="text-gray-500 font-medium">Gérez votre pipeline de recrutement en temps réel</p>
                </div>
                <Link to="/applications/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]">
                    <HiPlus className="text-xl" />
                    <span>Nouvelle candidature</span>
                </Link>
            </div>

            {/* FILTRES & RECHERCHE */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
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

            {/* GRILLE KANBAN (Colonnes de statut) */}
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
                        <div key={column.status} className={`bg-gray-100/50 rounded-2xl border border-gray-100 border-t-4 ${columnColors[column.status]} flex flex-col min-h-[600px] transition-all`}>
                            {/* Header de colonne avec Compteur */}
                            <div className="p-4 border-b border-gray-100 bg-white rounded-t-xl flex justify-between items-center shadow-sm">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    {column.title}
                                </h3>
                                <div className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-full font-black">
                                    {columnApps.length}
                                </div>
                            </div>

                            {/* Zone des cartes */}
                            <div className="p-3 flex flex-col gap-4">
                                {columnApps.map((app) => {
                                    const lastDate = new Date(app.updatedAt || app.createdAt);
                                    const daysSinceUpdate = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
                                    const isStale = daysSinceUpdate >= 7 && app.status === 'APPLIED';

                                    return (
                                        <div
                                            key={app.id}
                                            className="group relative bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${statusColors[app.status] || 'bg-indigo-400'}`} />

                                            <div className="pl-2">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                                                        {app.contractType || 'CDI'}
                                                    </span>
                                                    <span className={`text-[10px] uppercase font-bold ${isStale ? 'text-orange-600' : 'text-gray-400'}`}>
                                                        {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '-'}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                                                    {app.company}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate mb-4 italic">
                                                    {app.position}
                                                </p>

                                                {isStale && (
                                                    <div className="mb-4 flex items-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100 animate-pulse">
                                                        <HiBell className="h-3 w-3" />
                                                        RELANCE J+{daysSinceUpdate}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                    <div className="flex gap-2">
                                                        {app.offerUrl && (
                                                            <a href={app.offerUrl} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                                <HiExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
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