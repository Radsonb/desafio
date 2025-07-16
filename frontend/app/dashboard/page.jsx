'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import DashboardStats from '@/components/organisms/DashboardStats';
import Alert from '@/components/atoms/Alert';
import { useAuth } from '../contexts/AuthContext';
import dashboardService from '../servives/dashboardService';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    employees: 0,
    products: 0,
    clients: 0,
    sales: 0
  });
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
      const dashboardStats = await dashboardService.getStats();
      setStats(dashboardStats);
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
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3'>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adicionar Cliente
                </span>
              </div>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adicionar Produto
                </span>
              </div>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nova Venda
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span>Novo cliente cadastrado</span>
              <span className="ml-auto text-xs">2 min atrás</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span>Produto atualizado</span>
              <span className="ml-auto text-xs">5 min atrás</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              <span>Nova venda realizada</span>
              <span className="ml-auto text-xs">10 min atrás</span>
            </div>
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