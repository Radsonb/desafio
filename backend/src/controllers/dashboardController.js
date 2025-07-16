const companyRepository = require('../repositories/companyRepository');
const productRepository = require('../repositories/productRepository');
const clientRepository = require('../repositories/clientRepository');
const orderRepository = require('../repositories/orderRepository');

class DashboardController {
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const userCompanies = await companyRepository.findByUserId(userId);

      if (!Array.isArray(userCompanies) || userCompanies.length === 0) {
        return res.json({
          employees: 0,
          products: 0,
          clients: 0,
          sales: 0
        });
      }

      const companyIds = userCompanies.map(company => company._id);

      let totalProducts = 0;
      for (const companyId of companyIds) {
        const products = await productRepository.findByCompanyId(companyId);
        totalProducts += products.length;
      }

      let totalClients = 0;
      for (const companyId of companyIds) {
        const clients = await clientRepository.findByCompanyId(companyId);
        totalClients += clients.length;
      }

      let totalSales = 0;
      for (const companyId of companyIds) {
        const orders = await orderRepository.findByCompanyId(companyId);
        const companySales = orders.reduce((sum, order) => sum + (order.total_value || 0), 0);
        totalSales += companySales;
      }

      const totalEmployees = 1;
      res.json({
        employees: totalEmployees,
        products: totalProducts,
        clients: totalClients,
        sales: totalSales
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

module.exports = new DashboardController();