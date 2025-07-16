'use client'
import React, { useState } from 'react'
import Card from '../../../components/atoms/Card'
import Button from '../../../components/atoms/Button'
import Alert from '../../../components/atoms/Alert'
import FormField from '../../../components/molecules/FormField'
import Checkbox from '../../../components/molecules/Checkbox'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({ ...formData, rememberMe })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Entrar na sua conta
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Faça login para acessar o sistema
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
        </div>

        <div className='flex justify-center'>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-32 rounded-lg items-center bg-blue-600 text-white"
          >
            Entrar
          </Button>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Lembrar-me"
          />

          <a
            href="#"
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Esqueceu a senha?
          </a>
        </div>

        {/* Submit Button */}




        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <a
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Criar conta
          </a>
        </p>
      </form>
    </Card>
  )
}

export default LoginForm