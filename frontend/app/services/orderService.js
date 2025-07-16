import api from './api'

const orderService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.company_id) params.append('company_id', filters.company_id);
      if (filters.client_id) params.append('client_id', filters.client_id);
      if (filters.status) params.append('status', filters.status);

      const url = params.toString() ? `/orders?${params}` : `/orders`;
      const response = await api.get(url);
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar pedidos');
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar pedido');
    }
  },

  async create(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar pedido')
    }
  },

  async update(id, orderData) {
    try {
      const response = await api.put(`/orders/${id}`, orderData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar pedido')
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/orders/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao deletar pedido')
    }
  }
}

export default orderService;