'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardTemplate from '../../../components/templates/DashboardTemplate'
import ProductForm from '../../../components/molecules/ProductForm'
import ProductList from '../../../components/organisms/ProductList'
import Button from '../../../components/atoms/Button'
import Alert from '../../../components/atoms/Alert'
import { useAuth } from '../../contexts/AuthContext'
import productService from '../../services/productService'
import companyService from '../../services/companyService'
import { PlusIcon } from '@heroicons/react/24/outline'
import Card from '../../../components/atoms/Card'

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false); // Mude para false
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // DADOS MOCKADOS TEMPORÁRIOS - ADICIONE ISSO
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

    // Mock de produtos
    const mockProducts = [
      {
        _id: '1',
        name: 'Produto Exemplo 1',
        value: 199.99,
        description: 'Este é um produto de exemplo para testar a interface',
        company_id: {
          _id: '1',
          fantasy_name: 'Empresa Teste 1'
        }
      },
      {
        _id: '2',
        name: 'Produto Exemplo 2', 
        value: 299.50,
        description: 'Outro produto para demonstração da listagem',
        company_id: {
          _id: '2',
          fantasy_name: 'Empresa Teste 2'
        }
      },
      {
        _id: '3',
        name: 'Produto Sem Descrição',
        value: 99.99,
        description: '',
        company_id: {
          _id: '1',
          fantasy_name: 'Empresa Teste 1'
        }
      }
    ];

    setCompanies(mockCompanies);
    setProducts(mockProducts);
  }, []);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login')
  //     return
  //   }

  //   loadData()
  // }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, companiesData] = await Promise.all([
        productService.getAll(),
        companyService.getAll()
      ])
      setProducts(Array.isArray(productsData) ? productsData : [])
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      setError('Erro ao carregar produtos')
      console.error('Products error:', error)
    }
  };

  const handleCreateProduct = async (productData) => {
    // Simulação de criação
    const newProduct = {
      _id: Date.now().toString(),
      ...productData,
      company_id: companies.find(c => c._id === productData.company_id)
    };
    
    setProducts(prev => [...prev, newProduct]);
    setSuccess('Produto criado com sucesso! (Mock)');
    setShowForm(false);
  };

  const handleUpdateProduct = async (productData) => {
    // Simulação de atualização
    setProducts(prev => prev.map(p => 
      p._id === editingProduct._id 
        ? { ...p, ...productData, company_id: companies.find(c => c._id === productData.company_id) }
        : p
    ));
    setSuccess('Produto atualizado com sucesso! (Mock)');
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    // Simulação de exclusão
    setProducts(prev => prev.filter(p => p._id !== productId));
    setSuccess('Produto excluído com sucesso! (Mock)');
  };

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  };

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  };

  // if (!isAuthenticated) return null; // Comente esta linha

  return (
    <DashboardTemplate title="Produtos" subtitle='Gerencie os produtos disponíveis para venda'>
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
            Gerenciar Produtos
          </h2>
          {!showForm && companies.length > 0 && (
            <Button className='bg-green-600 rounded-xl text-white flex justify-center items-center gap-2' onClick={() => setShowForm(true)}>
              <PlusIcon className='w-5 h-5' />
              Novo Produto
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
            Para criar produtos, você deve ter pelo menos uma empresa cadastrada
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
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <ProductForm
              product={editingProduct}
              companies={companies}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </Card>
        </div>
      ) : (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
          loading={loading}
        />
      )}
    </DashboardTemplate>
  );
}