const { Client, Product, Order, Company } = require('../../database/models');

class ActivityRepository {
  async getRecentClients(userId, limit = 3) {
    try {
      return await Client.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name createdAt')
        .populate('company_id', 'fantasy_name');
    } catch (error) {
      throw new Error(`Erro ao buscar clientes recentes: ${error.message}`);
    }
  }

  async getRecentProducts(userId, limit = 3) {
    try {
      const userCompanies = await Company.find({ user_id: userId });
      const companyIds = userCompanies.map(company => company._id);

      return await Product.find({ company_id: { $in: companyIds } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name createdAt company_id')
        .populate('company_id', 'fantasy_name');
    } catch (error) {
      throw new Error(`Erro ao buscar produtos recentes: ${error.message}`)
    }
  }

  async getRecentOrders(userId, limit = 3) {
    try {
      const userCompanies = await Company.find({ user_id: userId }).select('_id');
      const companyIds = userCompanies.map(company => company._id);

      return await Order.find({ company_id: { $in: companyIds } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('status createdAt client_id total')
        .populate('client_id', 'name')
        .populate('company_id', 'fantasy_name');
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos recentes: ${error.message}`);
    }
  }
}

module.exports = new ActivityRepository();
