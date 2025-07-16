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
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
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

    const mockClients = [
      {
        _id: '1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-1234',
        company_id: { _id: '1', fantasy_name: 'Empresa Teste 1' }
      },
      {
        _id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 88888-5678',
        company_id: { _id: '2', fantasy_name: 'Empresa Teste 2' }
      },
      {
        _id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '',
        company_id: { _id: '1', fantasy_name: 'Empresa Teste 1' }
      }
    ];

    const mockProducts = [
      {
        _id: '1',
        name: 'Produto A',
        value: 199.99,
        description: 'Produto de exemplo',
        company_id: { _id: '1', fantasy_name: 'Empresa Teste 1' }
      },
      {
        _id: '2',
        name: 'Produto B', 
        value: 299.50,
        description: 'Outro produto',
        company_id: { _id: '2', fantasy_name: 'Empresa Teste 2' }
      },
      {
        _id: '3',
        name: 'Produto C',
        value: 99.99,
        description: 'Terceiro produto',
        company_id: { _id: '1', fantasy_name: 'Empresa Teste 1' }
      }
    ];

    const mockOrders = [
      {
        _id: '1',
        order_number: 1001,
        order_date: new Date().toISOString(),
        status: 'pending',
        total_value: 599.97,
        notes: 'Pedido urgente',
        company_id: { _id: '1', fantasy_name: 'Empresa Teste 1' },
        client_id: { _id: '1', name: 'João Silva', email: 'joao.silva@email.com' },
        products: [
          {
            product_id: '1',
            product: { _id: '1', name: 'Produto A' },
            quantity: 2,
            unit_price: 199.99,
            total_price: 399.98
          },
          {
            product_id: '3',
            product: { _id: '3', name: 'Produto C' },
            quantity: 2,
            unit_price: 99.99,
            total_price: 199.98
          }
        ]
      },
      {
        _id: '2',
        order_number: 1002,
        order_date: new Date(Date.now() - 86400000).toISOString(),
        status: 'confirmed',
        total_value: 299.50,
        notes: '',
        company_id: { _id: '2', fantasy_name: 'Empresa Teste 2' },
        client_id: { _id: '2', name: 'Maria Santos', email: 'maria.santos@email.com' },
        products: [
          {
            product_id: '2',
            product: { _id: '2', name: 'Produto B' },
            quantity: 1,
            unit_price: 299.50,
            total_price: 299.50
          }
        ]
      }
    ];

    setCompanies(mockCompanies);
    setClients(mockClients);
    setProducts(mockProducts);
    setOrders(mockOrders);
  }, []);

  const handleCreateOrder = async (orderData) => {
    const totalValue = orderData.products.reduce((sum, p) => {
      const product = products.find(pr => pr._id === p.product_id);
      return sum + (product.value * p.quantity);
    }, 0);

    const newOrder = {
      _id: Date.now().toString(),
      order_number: Math.max(...orders.map(o => o.order_number), 1000) + 1,
      order_date: new Date().toISOString(),
      total_value: totalValue,
      ...orderData,
      company_id: companies.find(c => c._id === orderData.company_id),
      client_id: clients.find(c => c._id === orderData.client_id),
      products: orderData.products.map(p => ({
        ...p,
        product: products.find(pr => pr._id === p.product_id),
        unit_price: products.find(pr => pr._id === p.product_id).value,
        total_price: products.find(pr => pr._id === p.product_id).value * p.quantity
      }))
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setSuccess('Pedido criado com sucesso! (Mock)');
    setShowForm(false);
  };

  const handleUpdateOrder = async (orderData) => {
    const totalValue = orderData.products.reduce((sum, p) => {
      const product = products.find(pr => pr._id === p.product_id);
      return sum + (product.value * p.quantity);
    }, 0);

    setOrders(prev => prev.map(o => 
      o._id === editingOrder._id 
        ? { 
            ...o, 
            ...orderData,
            total_value: totalValue,
            company_id: companies.find(c => c._id === orderData.company_id),
            client_id: clients.find(c => c._id === orderData.client_id),
            products: orderData.products.map(p => ({
              ...p,
              product: products.find(pr => pr._id === p.product_id),
              unit_price: products.find(pr => pr._id === p.product_id).value,
              total_price: products.find(pr => pr._id === p.product_id).value * p.quantity
            }))
          }
        : o
    ));
    setSuccess('Pedido atualizado com sucesso! (Mock)');
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }
    
    setOrders(prev => prev.filter(o => o._id !== orderId));
    setSuccess('Pedido excluído com sucesso! (Mock)');
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