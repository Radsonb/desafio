'use client'
import React from 'react'
import Button from '../../atoms/Button'
import Card from '../../atoms/Card'

const ProductList = ({ 
  products = [], 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum produto cadastrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Comece cadastrando seu primeiro produto
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product._id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(product.value)}
                </span>
              </div>
              
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {product.description}
                </p>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Empresa: {product.company_id?.fantasy_name || 'N/A'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(product._id)}
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

export default ProductList