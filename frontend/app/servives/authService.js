import api from './api'

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/users/login', credentials)
      
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/users', userData)
      
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
      } catch (error) {
        return null
      }
    }
    return null
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  handleError(error) {
    if (error.response?.data?.erro) {
      return new Error(error.response.data.erro)
    } else if (error.response?.data?.detalhes) {
      // Erros de validação
      const details = error.response.data.detalhes
      if (Array.isArray(details)) {
        return new Error(details.map(d => d.msg).join(', '))
      }
      return new Error(details)
    } else if (error.message) {
      return new Error(error.message)
    } else {
      return new Error('Erro inesperado. Tente novamente.')
    }
  }
}

export default new AuthService()