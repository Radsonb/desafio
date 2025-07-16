import api from './api'

const companyService = {
  // Buscar todas as empresas do usuário
  async getAll() {
    try {
      const response = await api.get('/companies')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar empresas')
    }
  },

  // Buscar empresa por ID
  async getById(id) {
    try {
      const response = await api.get(`/companies/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar empresa')
    }
  },

  // Criar nova empresa
  async create(companyData) {
    try {
      const response = await api.post('/companies', companyData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar empresa')
    }
  },

  // Atualizar empresa
  async update(id, companyData) {
    try {
      const response = await api.put(`/companies/${id}`, companyData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar empresa')
    }
  },

  // Deletar empresa
  async delete(id) {
    try {
      const response = await api.delete(`/companies/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao deletar empresa')
    }
  }
}

export default companyService
