'use client'
import React from 'react';
import DashboardHeader from '../../components/molecules/DashboardHeader';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <DashboardHeader user={user} onLogout={logout} />
      
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          {children}
        </div>
      </main>
    </div>
  );
}