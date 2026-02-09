import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    'TO_APPLY': 'bg-gray-100 text-gray-800',
    'APPLIED': 'bg-blue-100 text-blue-800',
    'FOLLOWED_UP': 'bg-yellow-100 text-yellow-800',
    'INTERVIEW': 'bg-purple-100 text-purple-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'OFFER_ACCEPTED': 'bg-green-100 text-green-800',
};

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    // 🆕 État pour la pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    useEffect(() => {
        fetchApplications(1, selectedStatus);
    }, [selectedStatus]); // 🆕 On ajoutera [pagination.currentPage] plus tard

    const fetchApplications = async (page = 1, status = 'ALL') => {
        const filterStatus = status || selectedStatus;
        try {
            setLoading(true);
            const statusParam = filterStatus !== 'ALL' ? `&status=${filterStatus}` : '';
            const response = await api.get(`/applications?page=${page}&limit=10${statusParam}`);

            // 🆕 Extraction des données et pagination
            setApplications(response.data.data);  // ← Fix du bug !
            setPagination(response.data.pagination);
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
    const goToNextPage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            fetchApplications(pagination.currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (pagination.currentPage > 1) {
            fetchApplications(pagination.currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            fetchApplications(pageNumber);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>

                    {/* 🆕 Filtre par statut */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                        }}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="ALL">All statuses</option>
                        <option value="TO_APPLY">To Apply</option>
                        <option value="APPLIED">Applied</option>
                        <option value="FOLLOWED_UP">Followed Up</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="OFFER_ACCEPTED">Offer Accepted</option>
                    </select>
                </div>

                <Link to="/applications/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <HiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Application
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-6">
                {[
                    { title: 'À postuler', status: 'TO_APPLY', color: 'border-gray-400' },
                    { title: 'Postulé', status: 'APPLIED', color: 'border-blue-500' },
                    { title: 'Relancé', status: 'FOLLOWED_UP', color: 'border-yellow-500' },
                    { title: 'Entretiens', status: 'INTERVIEW', color: 'border-purple-500' },
                    { title: 'Terminé', status: 'REJECTED', color: 'border-red-500' }
                ].map((column) => {
                    // On filtre les applications pour cette colonne précise
                    const columnApps = applications.filter(app => app.status === column.status);

                    return (
                        <div key={column.status} className="flex-1 min-w-[280px] bg-gray-100 rounded-xl p-3 shadow-inner">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex justify-between items-center px-1">
                                {column.title}
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                                    {columnApps.length}
                                </span>
                            </h3>

                            <div className="space-y-3">
                                {columnApps.map((app) => (
                                    <div
                                        key={app.id}
                                        className={`bg-white p-4 rounded-lg shadow-sm border-t-4 ${column.color} hover:shadow-md transition-shadow group`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900 leading-tight">{app.company}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{app.position}</p>
                                            </div>

                                            {/* Actions rapides au survol */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/applications/${app.id}/edit`} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                                    <HiPencil className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(app.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                    <HiTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400">
                                                {app.appliedDate ? format(new Date(app.appliedDate), 'dd MMM') : 'Pas de date'}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {columnApps.length === 0 && (
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg py-8 text-center">
                                        <p className="text-xs text-gray-400 italic">Aucune fiche</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {/* --- FIN DE LA VUE KANBAN --- */}

                {/* 🆕 CONTRÔLES DE PAGINATION */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                        {/* Version mobile */}
                        <button
                            onClick={goToPreviousPage}
                            disabled={pagination.currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                                </span> of{' '}
                                <span className="font-medium">{pagination.totalItems}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={pagination.currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    ←
                                </button>

                                {/* Numéros de page */}
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === pagination.currentPage
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={goToNextPage}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    →
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsList;
