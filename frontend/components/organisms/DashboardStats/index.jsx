'use client'
import React from 'react';

import {
  UsersIcon,
  CubeIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const DashboardStats = ({ stats, loading = false }) => {
  const safeStats = stats || {}

  const statItems = [
    {
      title: 'Funcionários',
      value: safeStats.employees || 0,
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'Produtos',
      value: stats.products || 0,
      icon: CubeIcon,
      color: 'green'
    },
    {
      title: 'Clientes',
      value: stats.clients || 0,
      icon: UserGroupIcon,
      color: 'purple'
    },
    {
      title: 'Vendas (R$)',
      value: stats.sales || 0,
      icon: CurrencyDollarIcon,
      color: 'orange'
    },

  ]
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {statItems.map(({item, index}) => {
        console.log(item);
        
      })}
    </div>
  )
}

export default DashboardStats