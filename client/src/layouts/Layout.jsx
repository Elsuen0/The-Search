import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiBriefcase, HiLogout } from 'react-icons/hi';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: HiHome },
        { name: 'Applications', href: '/applications', icon: HiBriefcase },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r">
                <div className="flex items-center justify-center h-16 border-b">
                    <span className="text-xl font-bold text-indigo-600">JobTracker</span>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    location.pathname === item.href
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        location.pathname === item.href
                                            ? 'text-indigo-600'
                                            : 'text-gray-400 group-hover:text-gray-500',
                                        'mr-3 flex-shrink-0 h-6 w-6'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                                <button
                                    onClick={logout}
                                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b md:hidden">
                    <span className="text-xl font-bold text-indigo-600">JobTracker</span>
                    <button onClick={logout}><HiLogout className="w-6 h-6 text-gray-600" /></button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
