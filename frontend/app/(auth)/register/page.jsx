'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthTemplate from '../../../components/templates/AuthTemplate'
import RegisterForm from '../../../components/organisms/RegisterForm'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleRegister = async (userData) => {
    setLoading(true)
    setError('')

    try {
      await register(userData)
      router.push('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate>
      <RegisterForm 
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </AuthTemplate>
  )
}
