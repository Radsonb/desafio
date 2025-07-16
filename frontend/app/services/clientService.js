import api from './api'

const clientService = {
  async getAll(companyId = null) {
    try {
      const url = companyId ? `/clients?company_id=${companyId}` : '/clients'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar clientes')
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/clients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar cliente')
    }
  },

  async create(clientData) {
    try {
      const response = await api.post('/clients', clientData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar cliente')
    }
  },

  async update(id, clientData) {
    try {
      const response = await api.put(`/clients/${id}`, clientData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar cliente')
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/clients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao deletar cliente')
    }
  },

  async search(query, companyId) {
    try {
      const response = await api.get(`/clients/search?q=${query}&company_id=${companyId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar clientes')
    }
  }
}

export default clientService