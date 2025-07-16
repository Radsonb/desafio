import api from './api'

const productService = {
  async getAll(companyId = null) {
    try {
      const url = companyId ? `/products?company_id=${companyId}` : '/products'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar produtos')
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar produto')
    }
  },

  async create(productData) {
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar produto')
    }
  },

  async update(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar produto')
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao deletar produto')
    }
  },

  async search(query, companyId) {
    try {
      const response = await api.get(`/products/search?q=${query}&company_id=${companyId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar produtos')
    }
  }
}

export default productService