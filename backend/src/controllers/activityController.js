const activityRepository = require('../repositories/activityRepository');

class ActivityController {
  async getRecentActivities(req, res) {
    try {
      const userId = req.user.id;
      const activities = [];

      const [recentClients, recentProducts, recentOrders] = await Promise.all([
        activityRepository.getRecentClients(userId, 3),
        activityRepository.getRecentProducts(userId, 3),
        activityRepository.getRecentOrders(userId, 3)
      ]);

      recentClients.forEach(client => {
        activities.push({
          type: 'client',
          message: `Cliente "${client.name}" foi cadastrado`,
          details: `Empresa: ${client.company_id?.fantasy_name || 'N/A'}`,
          time: client.createdAt,
          color: 'green'
        });
      });

      recentProducts.forEach(product => {
        activities.push({
          type: 'product',
          message: `Produto "${product.name}" foi adicionado`,
          details: `Empresa: ${product.company_id?.fantasy_name || 'N/A'}`,
          time: product.createdAt,
          color: 'blue'
        });
      });

      recentOrders.forEach(order => {
        const statusMap = {
          pending: 'Pendente',
          confirmed: 'Confirmado',
          preparing: 'Preparando',
          delivered: 'Entregue',
          cancelled: 'Cancelado'
        };

        activities.push({
          type: 'order',
          message: `Pedido para "${order.client_id?.name || 'Cliente'}"`,
          details: `Status: ${statusMap[order.status] || order.status}`,
          time: order.createdAt,
          color: 'orange'
        });
      });

      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      const recentActivities = activities.slice(0, 6);

      res.json(recentActivities);
    } catch (error) {
      console.error('Activity Controller Error:', error);
      res.status(500).json({ 
        erro: 'Erro ao buscar atividades recentes', 
        details: error.message 
      });
    }
  }
}

module.exports = new ActivityController();