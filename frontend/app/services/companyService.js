import api from './api'

const companyService = {
  async getAll() {
    try {
      const response = await api.get('/companies')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar empresas')
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/companies/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar empresa')
    }
  },

  async create(companyData) {
    try {
      const response = await api.post('/companies', companyData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar empresa')
    }
  },

  async update(id, companyData) {
    try {
      const response = await api.put(`/companies/${id}`, companyData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar empresa')
    }
  },

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
