'use client'
import React from 'react';
import Button from '../../atoms/Button';
import { BellIcon, FireIcon, UserCircleIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link';

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href='/dashboard' className='flex items-center space-x-2 cursor-pointer'>
            <FireIcon className='w-6 h-6 text-red-600' />
            <span className='text-xl font-bold text-gray-900 dark:text-white'>VenderGas</span>
          </Link>
          <div className='flex items-center space-x-4'>
            <button className='p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'>
              <BellIcon className='h-6 w-6' />
            </button>
            <div className='relative'>
              <button className='flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'>
                <UserCircleIcon className="h-6 w-6" />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{user?.name || 'Usuário'}</span>
              </button>
            </div>

            <Button
              variant='outline'
              size="sm"
              onClick={onLogout}
              className='rounded-xl hover:bg-gray-200'
            >
              
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader;