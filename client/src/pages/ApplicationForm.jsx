// --- 1. IMPORTS ---
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

// --- 2. COMPOSANT FORMULAIRE ---
const ApplicationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // -- ÉTAT DU FORMULAIRE --
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'TO_APPLY',
        appliedDate: '',
        reminderDate: '',
        notes: '',
    });

    // -- CHARGEMENT DES DONNÉES (Si Modification) --
    useEffect(() => {
        if (isEditMode) {
            fetchApplication();
        }
    }, [id]);

    const fetchApplication = async () => {
        try {
            const response = await api.get(`/applications/${id}`);
            const data = response.data;
            // Format dates for input fields (YYYY-MM-DD)
            setFormData({
                ...data,
                appliedDate: data.appliedDate ? data.appliedDate.split('T')[0] : '',
                reminderDate: data.reminderDate ? data.reminderDate.split('T')[0] : '',
            });
        } catch (error) {
            toast.error('Failed to load application details');
        }
    };

    // -- GESTION DES ACTIONS --
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/applications/${id}`, formData);
                toast.success('Application updated');
            } else {
                await api.post('/applications', formData);
                toast.success('Application created');
            }
            navigate('/applications');
        } catch (error) {
            toast.error('Failed to save application');
        }
    };

    // --- 3. RENDU DU FORMULAIRE ---
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {isEditMode ? 'Edit Application' : 'New Application'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                            type="text"
                            name="position"
                            required
                            value={formData.position}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="TO_APPLY">To Apply</option>
                            <option value="APPLIED">Applied</option>
                            <option value="FOLLOWED_UP">Followed Up</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="OFFER_ACCEPTED">Offer Accepted</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date Applied</label>
                        <input
                            type="date"
                            name="appliedDate"
                            value={formData.appliedDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Follow-up Reminder</label>
                        <input
                            type="date"
                            name="reminderDate"
                            value={formData.reminderDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        name="notes"
                        rows={4}
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/applications')}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isEditMode ? 'Update Application' : 'Create Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
