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



            <div className="flex flex-col">

                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">

                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">

                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                                {[
                                    { title: 'À postuler', status: 'TO_APPLY' },
                                    { title: 'Postulé', status: 'APPLIED' },
                                    { title: 'Relance', status: 'FOLLOWED_UP' },
                                    { title: 'Entretien', status: 'INTERVIEW' },
                                    { title: 'Finis', status: 'FINISH' } // Adapte selon tes statuts réels
                                ].map((column) => (
                                    <div key={column.status} className="bg-gray-50 rounded-lg border border-gray-200 flex flex-col h-full">
                                        {/* Entête de colonne fixe */}
                                        <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg">
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                                                {column.title}
                                            </h3>
                                        </div>

                                        {/* Zone des cartes */}
                                        <div className="p-2 space-y-3 min-h-[200px]">
                                            {applications
                                                .filter(app => app.status === column.status || (column.status === 'FINISH' && ['REJECTED', 'OFFER_ACCEPTED'].includes(app.status)))
                                                .map((app) => (
                                                    <div key={app.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 group relative">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-bold text-gray-900 text-sm truncate">{app.company}</span>
                                                            <span className="text-xs text-gray-500 truncate">{app.position}</span>
                                                        </div>

                                                        {/* Boutons d'action (apparaissent au survol) */}
                                                        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity justify-end border-t pt-2">
                                                            <Link to={`/applications/${app.id}/edit`} className="text-indigo-600">
                                                                <HiPencil className="h-4 w-4" />
                                                            </Link>
                                                            <button onClick={() => handleDelete(app.id)} className="text-red-600">
                                                                <HiTrash className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>

                </div>



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