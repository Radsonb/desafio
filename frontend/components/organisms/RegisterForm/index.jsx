'use client'
import React, { useState } from 'react'
import Card from '../../../components/atoms/Card'
import Button from '../../../components/atoms/Button'
import Alert from '../../../components/atoms/Alert'
import FormField from '../../../components/molecules/FormField'
import Checkbox from '../../../components/molecules/Checkbox'
import { EnvelopeIcon, LockClosedIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const RegisterForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  })

  const [errors, setErrors] = useState({})
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    if (!formData.company) {
      newErrors.company = 'Nome da empresa é obrigatório'
    }

    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso'
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

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Criar nova conta
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Preencha os dados para criar sua conta
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
          />
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <FormField
            label="Nome completo"
            name="name"
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            icon={UserIcon}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="nome@empresa.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            icon={EnvelopeIcon}
          />

          <FormField
            label="Empresa"
            name="company"
            type="text"
            placeholder="Nome da sua empresa"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            required
            icon={BuildingOfficeIcon}
          />

          <FormField
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            icon={LockClosedIcon}
          />

          <FormField
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            icon={LockClosedIcon}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            label="Eu aceito os termos de uso e política de privacidade"
          />
          {errors.terms && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.terms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className='flex justify-center'>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-32 rounded-lg items-center bg-blue-600 text-white"
          >
            Criar conta
          </Button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <a
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Fazer login
          </a>
        </p>
      </form>
    </Card>
  )
}

export default RegisterForm
