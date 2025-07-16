'use client'
import React, { useState, useEffect } from 'react'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'

const ProductForm = ({ 
  product = null, 
  companies = [],
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: '',
    company_id: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        value: product.value?.toString() || '',
        description: product.description || '',
        company_id: product.company_id?._id || product.company_id || ''
      })
    }
  }, [product])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Nome deve ter no máximo 50 caracteres'
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Valor é obrigatório'
    } else if (isNaN(formData.value) || parseFloat(formData.value) < 0) {
      newErrors.value = 'Valor deve ser um número maior ou igual a 0'
    }

    if (!formData.company_id) {
      newErrors.company_id = 'Empresa é obrigatória'
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Descrição deve ter no máximo 200 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value)
      }
      onSubmit(submitData)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatCurrency = (value) => {
    const numbers = value.replace(/[^\d.,]/g, '')
    return numbers
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Digite o nome do produto"
          maxLength={50}
          className='border border-gray-300 rounded-lg p-2'
        />
      </div>

      <div>
        <Label htmlFor="value">Valor (R$)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          min="0"
          value={formData.value}
          onChange={(e) => handleInputChange('value', e.target.value)}
          error={errors.value}
          placeholder="0.00"
          className='border border-gray-300 rounded-lg p-2'
        />
      </div>

      <div>
        <Label htmlFor="company_id">Empresa</Label>
        <select
          id="company_id"
          value={formData.company_id}
          onChange={(e) => handleInputChange('company_id', e.target.value)}
          className={`w-full border border-gray-300 rounded-lg p-2 ${errors.company_id ? 'border-red-500' : ''}`}
          disabled={!!product} // Desabilita edição da empresa se estiver editando
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
        <Label htmlFor="description">Descrição (Opcional)</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Digite uma descrição para o produto"
          maxLength={200}
          rows={3}
          className={`w-full border border-gray-300 rounded-lg p-2 resize-none ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.description.length}/200 caracteres
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-xl text-white"
        >
          {product ? 'Atualizar Produto' : 'Criar Produto'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default ProductForm