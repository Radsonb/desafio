'use client'
import React from 'react'
import Button from '../../atoms/Button'
import Card from '../../atoms/Card'

const CompanyList = ({ 
  companies = [], 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma empresa cadastrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Comece cadastrando sua primeira empresa
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <Card key={company._id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {company.fantasy_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {company.razao_social}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                CNPJ: {company.cnpj}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(company)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(company._id)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default CompanyList