import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HiPlus, HiPencil, HiTrash, HiExternalLink, HiSearch } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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

    return (
        <div className="max-w-full overflow-x-hidden">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                        <p className="text-sm text-gray-500">Gérez vos {applications.length} candidatures</p>
                    </div>

                    <div className="flex flex-1 w-full md:w-auto max-w-md gap-3">
                        {/* Barre de recherche */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher une entreprise ou un poste..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                            />
                        </div>
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="ALL">Tous les statuts</option>
                        <option value="TO_APPLY">À postuler</option>
                        <option value="APPLIED">Postulé</option>
                        <option value="FOLLOWED_UP">Relance</option>
                        <option value="INTERVIEW">Entretien</option>
                        <option value="REJECTED">Refusé</option>
                        <option value="OFFER_ACCEPTED">Offre acceptée</option>
                    </select>
                </div>

                <Link to="/applications/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <HiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Ajouter
                </Link>
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
                            <div className="p-2 flex flex-col -space-y-12 pb-20">
                                {columnApps.map((app, index) => (
                                    <div
                                        key={app.id}
                                        style={{ zIndex: index }}
                                        className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-6 hover:z-[100] cursor-pointer"
                                    >
                                        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${statusColors[app.status] || 'bg-indigo-400'}`} />

                                        <div className="pl-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 uppercase tracking-wider">
                                                    {app.contractType || 'CDI'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 uppercase font-semibold">
                                                    {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '-'}
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                {app.company}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate mb-3 italic">
                                                {app.position}
                                            </p>

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
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationsList;