'use client'
import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  loading = flase,
  className = ''
}) => {
  const colors = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      ligth: 'bg-blue-50',
      dark: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      ligth: 'bg-green-50',
      dark: 'bg-green-100'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      ligth: 'bg-purple-50',
      dark: 'bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      ligth: 'bg-orange-50',
      dark: 'bg-orange-100'
    }
  }

  const colorScheme = colors[color]

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className='flex items-center'>
        <div className={`p-3 rounded-full ${colorScheme.ligth} dark:${colorScheme.dark}`}>
          <Icon className={`h-6 w-6 ${colorScheme.text}`} />
        </div>
        <div className='ml-4'>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            {title}
          </p>
          {loading ? (
            <div className='h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
          ) : (
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {value?.toLocaleString() || '0'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard