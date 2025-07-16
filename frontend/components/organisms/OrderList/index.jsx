'use client'
import React from 'react'
import Button from '../../atoms/Button'
import Card from '../../atoms/Card'

const OrderList = ({ 
  orders = [], 
  onEdit, 
  onDelete, 
  onViewDetails,
  loading = false 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      preparing: { label: 'Preparando', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    }
    return configs[status] || configs.pending
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum pedido cadastrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Comece criando seu primeiro pedido
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status)
        
        return (
          <Card key={order._id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pedido #{order.order_number}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(order.total_value)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Cliente:</span> {order.client_id?.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span> {order.client_id?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Empresa:</span> {order.company_id?.fantasy_name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Data:</span> {formatDate(order.order_date)}
                    </p>
                  </div>
                </div>

                {order.products && order.products.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Produtos ({order.products.length}):
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {order.products.slice(0, 2).map((item, index) => (
                        <span key={index}>
                          {item.product?.name} (x{item.quantity})
                          {index < Math.min(order.products.length, 2) - 1 && ', '}
                        </span>
                      ))}
                      {order.products.length > 2 && (
                        <span> e mais {order.products.length - 2}...</span>
                      )}
                    </div>
                  </div>
                )}

                {order.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Obs:</span> {order.notes}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(order)}
                  className="text-xs rounded-lg"
                >
                  Detalhes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(order)}
                  className="text-xs rounded-lg"
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(order._id)}
                  className="text-xs rounded-lg"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default OrderList