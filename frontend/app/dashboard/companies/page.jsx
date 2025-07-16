'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardTemplate from '../../../components/templates/DashboardTemplate'
import CompanyForm from '../../../components/molecules/CompanyForm'
import CompanyList from '../../../components/organisms/CompanyList'
import Button from '../../../components/atoms/Button'
import Alert from '../../../components/atoms/Alert'
import { useAuth } from '../../contexts/AuthContext'
import companyService from '../../services/companyService'
import { PlusIcon } from '@heroicons/react/24/outline'
import Card from '../../../components/atoms/Card'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const { isAuthenticated } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login')
  //     return
  //   }

  //   loadCompanies()
  // }, [isAuthenticated, router]);

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const data = await companyService.getAll()
      setCompanies(Array.isArray(data) ? data : [])
    } catch (error) {
      setError('Erro ao carregar empresas')
      console.error('Companies error:', error)
    } finally {
      setLoading(false)
    }
  };

  const handleCreateCompany = async (companyData) => {
    try {
      setFormLoading(true)
      await companyService.create(companyData)
      setSuccess('Empresa criada com sucesso!')
      setShowForm(false)
      loadCompanies()
    } catch (error) {
      setError(error.message)
    } finally {
      setFormLoading(false)
    }
  };

  const handleUpdateCompany = async (companyData) => {
    try {
      setFormLoading(true)
      await companyService.update(editingCompany._id, companyData)
      setSuccess('Empresa atualizada com sucesso!')
      setShowForm(false)
      setEditingCompany(null)
      loadCompanies()
    } catch (error) {
      setError(error.message)
    } finally {
      setFormLoading(false)
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) {
      return
    }

    try {
      await companyService.delete(companyId)
      setSuccess('Empresa excluída com sucesso!')
      loadCompanies()
    } catch (error) {
      setError(error.message)
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company)
    setShowForm(true)
  };

  const handleCancel = () => {
    setShowForm(false)
    setEditingCompany(null)
  };

  // if (!isAuthenticated) return null;

  return (
    <DashboardTemplate title="Empresas" subtitle='Gerencie as empresas que vendem seus produtos'>
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
            Gerenciar Empresas
          </h2>
          {!showForm && (
            <Button className='bg-green-600 rounded-xl text-white flex justify-center items-center gap-2' onClick={() => setShowForm(true)}>
              <PlusIcon className='w-5 h-5' />
              Nova Empresa
            </Button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
            </h3>
            <CompanyForm
              company={editingCompany}
              onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </Card>
        </div>
      ) : (
        <CompanyList
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDeleteCompany}
          loading={loading}
        />
      )}
    </DashboardTemplate>
  );
}