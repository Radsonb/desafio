'use client'
import React, { useState, useEffect } from 'react'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'

const CompanyForm = ({ 
  company = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    fantasy_name: '',
    razao_social: '',
    cnpj: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (company) {
      setFormData({
        fantasy_name: company.fantasy_name || '',
        razao_social: company.razao_social || '',
        cnpj: company.cnpj || ''
      })
    }
  }, [company])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fantasy_name.trim()) {
      newErrors.fantasy_name = 'Nome fantasia é obrigatório'
    } else if (formData.fantasy_name.length > 30) {
      newErrors.fantasy_name = 'Nome fantasia deve ter no máximo 30 caracteres'
    }

    if (!formData.razao_social.trim()) {
      newErrors.razao_social = 'Razão social é obrigatória'
    } else if (formData.razao_social.length > 50) {
      newErrors.razao_social = 'Razão social deve ter no máximo 50 caracteres'
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório'
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'
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

  const formatCnpj = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    }
    return value
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="fantasy_name">Nome Fantasia</Label>
        <Input
          id="fantasy_name"
          type="text"
          value={formData.fantasy_name}
          onChange={(e) => handleInputChange('fantasy_name', e.target.value)}
          error={errors.fantasy_name}
          placeholder="Digite o nome fantasia"
          maxLength={30}
          className='border border-gray-300 rounded-lg p-2 '
        />
      </div>

      <div>
        <Label htmlFor="razao_social">Razão Social</Label>
        <Input
          id="razao_social"
          type="text"
          value={formData.razao_social}
          onChange={(e) => handleInputChange('razao_social', e.target.value)}
          error={errors.razao_social}
          placeholder="Digite a razão social"
          maxLength={50}
          className='border border-gray-300 rounded-lg p-2 '
        />
      </div>

      <div>
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          id="cnpj"
          type="text"
          value={formData.cnpj}
          onChange={(e) => handleInputChange('cnpj', formatCnpj(e.target.value))}
          error={errors.cnpj}
          placeholder="XX.XXX.XXX/XXXX-XX"
          maxLength={18}
          className='border border-gray-300 rounded-lg p-2 '
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-xl text-white"
        >
          {company ? 'Atualizar Empresa' : 'Criar Empresa'}
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

export default CompanyForm