import api from './api'

const clientService = {
  // Buscar todos os clientes do usuário
  async getAll(companyId = null) {
    try {
      const url = companyId ? `/clients?company_id=${companyId}` : '/clients'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar clientes')
    }
  },

  // Buscar cliente por ID
  async getById(id) {
    try {
      const response = await api.get(`/clients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar cliente')
    }
  },

  // Criar novo cliente
  async create(clientData) {
    try {
      const response = await api.post('/clients', clientData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar cliente')
    }
  },

  // Atualizar cliente
  async update(id, clientData) {
    try {
      const response = await api.put(`/clients/${id}`, clientData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar cliente')
    }
  },

  // Deletar cliente
  async delete(id) {
    try {
      const response = await api.delete(`/clients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao deletar cliente')
    }
  },

  // Buscar clientes por nome/email
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