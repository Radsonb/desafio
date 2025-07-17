'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardTemplate from '../../../components/templates/DashboardTemplate'
import ClientForm from '../../../components/molecules/ClientForm'
import ClientList from '../../../components/organisms/ClientList'
import Button from '../../../components/atoms/Button'
import Alert from '../../../components/atoms/Alert'
import { useAuth } from '../../contexts/AuthContext'
import clientService from '../../services/clientService'
import companyService from '../../services/companyService'
import { PlusIcon } from '@heroicons/react/24/outline'
import Card from '../../../components/atoms/Card'

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadData()
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true)
      const [clientsData, companiesData] = await Promise.all([
        clientService.getAll(),
        companyService.getAll()
      ])
      setClients(Array.isArray(clientsData) ? clientsData : [])
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getAll()
      setClients(Array.isArray(data) ? data : [])
    } catch (error) {
      setError('Erro ao carregar clientes')
      console.error('Clients error:', error)
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      setFormLoading(true)
      await clientService.create(clientData)
      setSuccess('Cliente criado com sucesso!')
      setShowForm(false)
      loadClients()
    } catch (error) {
      setError(error.message)
    } finally {
      setFormLoading(false)
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      setFormLoading(true)
      await clientService.update(editingClient._id, clientData)
      setSuccess('Cliente atualizado com sucesso!')
      setShowForm(false)
      setEditingClient(null)
      loadClients()
    } catch (error) {
      setError(error.message)
    } finally {
      setFormLoading(false)
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      await clientService.delete(clientId)
      setSuccess('Cliente excluído com sucesso!')
      loadClients()
    } catch (error) {
      setError(error.message)
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client)
    setShowForm(true)
  };

  const handleCancel = () => {
    setShowForm(false)
    setEditingClient(null)
  };


  if (!isAuthenticated) return null;

  return (
    <DashboardTemplate title="Clientes" subtitle='Gerencie seus clientes e contatos'>
      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Clientes
          </h2>
          {!showForm && companies.length > 0 && (
            <Button className='bg-green-600 rounded-xl text-white flex justify-center items-center gap-2' onClick={() => setShowForm(true)}>
              <PlusIcon className='w-5 h-5' />
              Novo Cliente
            </Button>
          )}
        </div>
      </div>

      {companies.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Você precisa cadastrar uma empresa primeiro
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Para criar clientes, você deve ter pelo menos uma empresa cadastrada
          </p>
          <Button 
            onClick={() => router.push('/dashboard/companies')}
            className="bg-blue-500 hover:bg-blue-400 text-white"
          >
            Ir para Empresas
          </Button>
        </div>
      ) : showForm ? (
        <div className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            <ClientForm
              client={editingClient}
              companies={companies}
              onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </Card>
        </div>
      ) : (
        <ClientList
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDeleteClient}
          loading={loading}
        />
      )}
    </DashboardTemplate>
  );
}