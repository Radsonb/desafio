'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthTemplate from '../../../components/templates/AuthTemplate'
import LoginForm from '../../../components/organisms/LoginForm'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (credentials) => {
    setLoading(true)
    setError('')

    try {
      await login(credentials)
      router.push('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate>
      <LoginForm 
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthTemplate>
  )
}