'use client'
import React, { useState, useEffect } from 'react'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'

const ClientForm = ({ 
  client = null, 
  companies = [],
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_id: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company_id: client.company_id?._id || client.company_id || ''
      })
    }
  }, [client])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do cliente é obrigatório'
    } else if (formData.name.length > 30) {
      newErrors.name = 'Nome deve ter no máximo 30 caracteres'
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.name)) {
      newErrors.name = 'Nome deve conter apenas letras e espaços'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido'
    } else if (formData.email.length > 50) {
      newErrors.email = 'Email deve ter no máximo 50 caracteres'
    }

    if (!formData.company_id) {
      newErrors.company_id = 'Empresa é obrigatória'
    }

    if (formData.phone && formData.phone.length > 15) {
      newErrors.phone = 'Telefone deve ter no máximo 15 caracteres'
    } else if (formData.phone && !/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve conter apenas números e os símbolos: - ( ) +'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                   .replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
                   .replace(/^(\d{2})(\d{0,5})$/, '($1) $2')
                   .replace(/^(\d{0,2})$/, '$1')
    }
    return value
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nome do Cliente</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Digite o nome completo"
          maxLength={30}
          className='border border-gray-300 rounded-lg p-2'
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value.toLowerCase())}
          error={errors.email}
          placeholder="cliente@exemplo.com"
          maxLength={50}
          className='border border-gray-300 rounded-lg p-2'
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefone (Opcional)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
          error={errors.phone}
          placeholder="(11) 99999-9999"
          maxLength={15}
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
          disabled={!!client} // Desabilita edição da empresa se estiver editando
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

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-xl text-white"
        >
          {client ? 'Atualizar Cliente' : 'Criar Cliente'}
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

export default ClientForm