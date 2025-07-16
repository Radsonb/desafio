'use client'
import React, { useState, useEffect } from 'react'
import Button from '../../atoms/Button'
import Label from '../../atoms/Label'
import ProductSelector from '../ProductSelector'

const OrderForm = ({ 
  order = null, 
  companies = [],
  clients = [],
  products = [],
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    company_id: '',
    client_id: '',
    notes: '',
    status: 'pending',
    products: []
  })
  const [errors, setErrors] = useState({})
  const [filteredClients, setFilteredClients] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    if (order) {
      setFormData({
        company_id: order.company_id?._id || '',
        client_id: order.client_id?._id || '',
        notes: order.notes || '',
        status: order.status || 'pending',
        products: order.products || []
      })
    }
  }, [order])

  useEffect(() => {
    if (formData.company_id) {
      setFilteredClients(clients.filter(c => c.company_id._id === formData.company_id))
      setFilteredProducts(products.filter(p => p.company_id._id === formData.company_id))
    } else {
      setFilteredClients([])
      setFilteredProducts([])
    }
  }, [formData.company_id, clients, products])

  const statusOptions = [
    { value: 'pending', label: 'Pendente', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmado', color: 'blue' },
    { value: 'preparing', label: 'Preparando', color: 'orange' },
    { value: 'delivered', label: 'Entregue', color: 'green' },
    { value: 'cancelled', label: 'Cancelado', color: 'red' }
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.company_id) {
      newErrors.company_id = 'Empresa é obrigatória'
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Cliente é obrigatório'
    }

    if (formData.products.length === 0) {
      newErrors.products = 'Adicione pelo menos um produto ao pedido'
    }

    if (formData.notes && formData.notes.length > 200) {
      newErrors.notes = 'Observações devem ter no máximo 200 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const orderData = {
        ...formData,
        products: formData.products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity
        }))
      }
      onSubmit(orderData)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="company_id">Empresa</Label>
          <select
            id="company_id"
            value={formData.company_id}
            onChange={(e) => {
              handleInputChange('company_id', e.target.value)
              handleInputChange('client_id', '')
              handleInputChange('products', [])
            }}
            className={`w-full border border-gray-300 rounded-lg p-2 ${errors.company_id ? 'border-red-500' : ''}`}
            disabled={!!order}
          >
            <option value="">Selecione uma empresa</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.fantasy_name}
              </option>
            ))}
          </select>
          {errors.company_id && (
            <p className="text-red-500 text-sm mt-1">{errors.company_id}</p>
          )}
        </div>

        <div>
          <Label htmlFor="client_id">Cliente</Label>
          <select
            id="client_id"
            value={formData.client_id}
            onChange={(e) => handleInputChange('client_id', e.target.value)}
            className={`w-full border border-gray-300 rounded-lg p-2 ${errors.client_id ? 'border-red-500' : ''}`}
            disabled={!formData.company_id}
          >
            <option value="">Selecione um cliente</option>
            {filteredClients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>
          )}
        </div>
      </div>

      {order && (
        <div>
          <Label htmlFor="status">Status do Pedido</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label>Produtos</Label>
        <ProductSelector
          products={filteredProducts}
          selectedProducts={formData.products}
          onChange={(products) => handleInputChange('products', products)}
          error={errors.products}
        />
      </div>

      <div>
        <Label htmlFor="notes">Observações (Opcional)</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Observações sobre o pedido"
          maxLength={200}
          rows={3}
          className={`w-full border border-gray-300 rounded-lg p-2 resize-none ${errors.notes ? 'border-red-500' : ''}`}
        />
        {errors.notes && (
          <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.notes.length}/200 caracteres
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-xl text-white"
        >
          {order ? 'Atualizar Pedido' : 'Criar Pedido'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-xl hover:bg-gray-200"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default OrderForm