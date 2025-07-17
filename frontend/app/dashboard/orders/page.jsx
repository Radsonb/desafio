'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardTemplate from '../../../components/templates/DashboardTemplate'
import OrderForm from '../../../components/molecules/OrderForm'
import OrderList from '../../../components/organisms/OrderList'
import Button from '../../../components/atoms/Button'
import Alert from '../../../components/atoms/Alert'
import { useAuth } from '../../contexts/AuthContext'
import orderService from '../../services/orderService'
import companyService from '../../services/companyService'
import clientService from '../../services/clientService'
import productService from '../../services/productService'
import { PlusIcon } from '@heroicons/react/24/outline'
import Card from '../../../components/atoms/Card'

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { isAuthenticated } = useAuth();

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
      const [ordersData, companiesData, clientsData, productsData] = await Promise.all([
        orderService.getAll(),
        companyService.getAll(),
        clientService.getAll(),
        productService.getAll()
      ])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
      setClients(Array.isArray(clientsData) ? clientsData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  };

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      setError('Erro ao carregar pedidos')
      console.error('Orders error:', error)
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      setFormLoading(true)
      await orderService.create(orderData)
      setSuccess('Pedido criado com sucesso!')
      setShowForm(false)
      loadOrders()
    } catch (error) {
      setError(error.message)
    } finally {
      setFormLoading(false)
    }
  };

  const handleUpdateOrder = async (orderData) => {
    try {
      setFormLoading(true)
      await orderService.update(editingOrder._id, orderData)
      setSuccess('Pedido atualizado com sucesso!')
      setShowForm(false)
      setEditingOrder(null)
      loadOrders()
    } catch (error) {
      setError(error.message)
    } finally {
      setFormLoading(false)
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return
    }

    try {
      await orderService.delete(orderId)
      setSuccess('Pedido excluído com sucesso!')
      loadOrders()
    } catch (error) {
      setError(error.message)
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleViewDetails = (order) => {
    alert(`Detalhes do Pedido #${order.order_number}\n\nImplementar modal de detalhes aqui`);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const router = useRouter();

  if (!isAuthenticated) return null;

  return (
    <DashboardTemplate title="Pedidos" subtitle='Gerencie pedidos e vendas'>
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Pedidos
          </h2>
          {!showForm && companies.length > 0 && clients.length > 0 && products.length > 0 && (
            <Button className='bg-green-600 rounded-xl text-white flex justify-center items-center gap-2' onClick={() => setShowForm(true)}>
              <PlusIcon className='w-5 h-5' />
              Novo Pedido
            </Button>
          )}
        </div>
      </div>

      {(companies.length === 0 || clients.length === 0 || products.length === 0) && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Você precisa ter empresas, clientes e produtos cadastrados
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Para criar pedidos, configure primeiro suas empresas, clientes e produtos
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/dashboard/companies')} className="bg-blue-500 hover:bg-blue-400 text-white">
              Empresas
            </Button>
            <Button onClick={() => router.push('/dashboard/clients')} className="bg-blue-500 hover:bg-blue-400 text-white">
              Clientes
            </Button>
            <Button onClick={() => router.push('/dashboard/products')} className="bg-blue-500 hover:bg-blue-400 text-white">
              Produtos
            </Button>
          </div>
        </div>
      ) : showForm ? (
        <div className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {editingOrder ? 'Editar Pedido' : 'Novo Pedido'}
            </h3>
            <OrderForm
              order={editingOrder}
              companies={companies}
              clients={clients}
              products={products}
              onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </Card>
        </div>
      ) : (
        <OrderList
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDeleteOrder}
          onViewDetails={handleViewDetails}
          loading={loading}
        />
      )}
    </DashboardTemplate>
  );
}