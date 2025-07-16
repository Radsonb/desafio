import api from './api';

class DashboardService {
  async getStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        employees: 0,
        products: 0,
        clients: 0,
        sales: 0
      }
    }
  }

  async getRecentActivity() {
    try {
      const response = await api.get('/dashboard/recent-activity');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar atividades recentes:", error);
      return [];      
    }
  }
}

export default new DashboardService();