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
  const [loading, setLoading] = useState(false); // Para visualização
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // DADOS MOCKADOS TEMPORÁRIOS
  useEffect(() => {
    // Mock de empresas
    const mockCompanies = [
      {
        _id: '1',
        fantasy_name: 'Empresa Teste 1',
        razao_social: 'Empresa Teste LTDA',
        cnpj: '12.345.678/0001-90'
      },
      {
        _id: '2', 
        fantasy_name: 'Empresa Teste 2',
        razao_social: 'Segunda Empresa LTDA',
        cnpj: '98.765.432/0001-10'
      }
    ];

    // Mock de clientes
    const mockClients = [
      {
        _id: '1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-1234',
        company_id: {
          _id: '1',
          fantasy_name: 'Empresa Teste 1'
        }
      },
      {
        _id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 88888-5678',
        company_id: {
          _id: '2',
          fantasy_name: 'Empresa Teste 2'
        }
      },
      {
        _id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '',
        company_id: {
          _id: '1',
          fantasy_name: 'Empresa Teste 1'
        }
      },
      {
        _id: '4',
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '(21) 77777-9999',
        company_id: {
          _id: '2',
          fantasy_name: 'Empresa Teste 2'
        }
      }
    ];

    setCompanies(mockCompanies);
    setClients(mockClients);
  }, []);

  const handleCreateClient = async (clientData) => {
    // Simulação de criação
    const newClient = {
      _id: Date.now().toString(),
      ...clientData,
      company_id: companies.find(c => c._id === clientData.company_id)
    };
    
    setClients(prev => [...prev, newClient]);
    setSuccess('Cliente criado com sucesso! (Mock)');
    setShowForm(false);
  };

  const handleUpdateClient = async (clientData) => {
    // Simulação de atualização
    setClients(prev => prev.map(c => 
      c._id === editingClient._id 
        ? { ...c, ...clientData, company_id: companies.find(comp => comp._id === clientData.company_id) }
        : c
    ));
    setSuccess('Cliente atualizado com sucesso! (Mock)');
    setShowForm(false);
    setEditingClient(null);
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }
    
    // Simulação de exclusão
    setClients(prev => prev.filter(c => c._id !== clientId));
    setSuccess('Cliente excluído com sucesso! (Mock)');
  };

  const handleEdit = (client) => {
    setEditingClient(client)
    setShowForm(true)
  };

  const handleCancel = () => {
    setShowForm(false)
    setEditingClient(null)
  };

  const router = useRouter();

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