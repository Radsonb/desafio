'use client'
import React, { useState } from 'react'
import Button from '../../atoms/Button'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const ProductSelector = ({ 
  products = [], 
  selectedProducts = [], 
  onChange, 
  error 
}) => {
  const [newProduct, setNewProduct] = useState({
    product_id: '',
    quantity: 1
  })

  const addProduct = () => {
    if (!newProduct.product_id) return

    const product = products.find(p => p._id === newProduct.product_id)
    if (!product) return

    const existingIndex = selectedProducts.findIndex(p => p.product_id === newProduct.product_id)
    
    if (existingIndex >= 0) {
      const updated = [...selectedProducts]
      updated[existingIndex].quantity += newProduct.quantity
      onChange(updated)
    } else {
      const productToAdd = {
        product_id: newProduct.product_id,
        product: product,
        quantity: newProduct.quantity,
        unit_price: product.value,
        total_price: product.value * newProduct.quantity
      }
      onChange([...selectedProducts, productToAdd])
    }

    setNewProduct({ product_id: '', quantity: 1 })
  }

  const removeProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return
    
    const updated = [...selectedProducts]
    updated[index].quantity = quantity
    updated[index].total_price = updated[index].unit_price * quantity
    onChange(updated)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const totalOrder = selectedProducts.reduce((sum, item) => sum + item.total_price, 0)

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Adicionar Produto
        </h4>
        
        <div className="flex gap-3">
          <select
            value={newProduct.product_id}
            onChange={(e) => setNewProduct(prev => ({ ...prev, product_id: e.target.value }))}
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - {formatCurrency(product.value)}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            min="1"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            className="w-20 border border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Qtd"
          />
          
          <Button
            type="button"
            onClick={addProduct}
            disabled={!newProduct.product_id}
            className="bg-green-500 hover:bg-green-400 text-white px-3 py-1"
            size="sm"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Produtos no Pedido
          </h4>
          
          {selectedProducts.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-800">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.unit_price)} x {item.quantity} = {formatCurrency(item.total_price)}
                </p>
              </div>
              
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                className="w-16 border border-gray-300 rounded p-1 text-sm"
              />
              
              <Button
                type="button"
                onClick={() => removeProduct(index)}
                variant="danger"
                size="sm"
                className="p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Total do Pedido:
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalOrder)}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

export default ProductSelector