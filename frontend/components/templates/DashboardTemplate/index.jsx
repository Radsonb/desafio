'use client'
import React from 'react';
import DashboardHeader from '@/components/molecules/DashboardHeader/index.';
import { useAuth } from '../../../app/contexts/AuthContext';

const DashboardTemplate = ({ children, title = 'Dashboad' }) => {
  const { user, logout } = useAuth();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <DashboardHeader user={user} onLogout={logout} />

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 ppy-6 sx:px-0'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              { title }
            </h1>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
              Bem-vindo ao painel de controle do VenderGas
            </p>
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardTemplate;