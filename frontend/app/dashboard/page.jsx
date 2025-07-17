'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import DashboardStats from '../../components/organisms/DashboardStats';
import Alert from '../../components/atoms/Alert';
import { useAuth } from '../contexts/AuthContext';
import dashboardService from '../services/dashboardService';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    employees: 0,
    products: 0,
    clients: 0,
    sales: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return
    }

    loadDashboardData();
  }, [isAuthenticated, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardStats, recentActivities] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivities()
      ]);
      setStats(dashboardStats);
      setActivities(recentActivities);
    } catch (error) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardTemplate title='Dashboard'>
      {error && (
        <div className='mb-6'>
          <Alert
            type='error'
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      <div className='mb-8'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          Visão Geral
        </h2>
        <DashboardStats stats={stats} loading={loading} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Ações Rápidas</h3>
          <div className='space-y-3'>
            <button className='w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
              <Link href="/dashboard/clients" className='flex items-center'>
                <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3'>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adicionar Cliente
                </span>
              </Link>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Link href="/dashboard/products" className="flex items-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adicionar Produto
                </span>
              </Link>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Link href="/dashboard/orders" className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nova Venda
                </span>
              </Link>
            </button>

            <button  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Link href="/dashboard/companies" className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-bold"></span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gerenciar Empresas
                </span>
              </Link>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-500 py-4">
                <div className="animate-pulse">Carregando atividades...</div>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400 py-2">
                  <div className={`w-2 h-2 bg-${activity.color}-400 rounded-full mr-3 mt-2 flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{activity.message}</div>
                    {activity.details && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {activity.details}
                      </div>
                    )}
                  </div>
                  <span className="ml-3 text-xs text-gray-400 flex-shrink-0">
                    {new Date(activity.time).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <div className="text-sm">Nenhuma atividade recente</div>
                <div className="text-xs mt-1">Comece cadastrando empresas, produtos ou clientes!</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Versão</span>
              <span className="text-gray-900 dark:text-white font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Última atualização</span>
              <span className="text-gray-900 dark:text-white font-medium">Hoje</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  )
}