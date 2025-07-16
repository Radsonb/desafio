const { Order, OrderProduct, Product, Client, Company } = require('../../database/models');

class OrderRepository {
  async create(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }
  }

  async addProductsToOrder(orderId, products) {
    try {
      let totalValue = 0;
      const orderProducts = [];

      for (const item of products) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new Error(`Produto ${item.product_id} não encontrado`);
        }

        const orderProduct = {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.value,
          total_price: product.value * item.quantity
        };

        orderProducts.push(orderProduct);
        totalValue += orderProduct.total_price;
      }

      await OrderProduct.insertMany(orderProducts);

      await Order.findByIdAndUpdate(orderId, { total_value: totalValue });

      return { orderProducts, totalValue };
    } catch (error) {
      throw new Error(`Erro ao adicionar produtos ao pedido: ${error.message}`);
    }
  }

  async show(id) {
    try {
      const order = await Order.findById(id)
        .populate('company_id', 'fantasy_name razao_social')
        .populate('client_id', 'name email phone');

      if (!order) return null;

      const orderProducts = await OrderProduct.find({ order_id: id })
        .populate('product_id', 'name description');

      return {
        ...order.toObject(),
        products: orderProducts
      };
    } catch (error) {
      throw new Error(`Erro ao buscar pedido por ID: ${error.message}`);
    }
  }

  async findByCompanyId(companyId) {
    try {
      return await Order.find({ company_id: companyId })
        .populate('company_id', 'fantasy_name razao_social')
        .populate('client_id', 'name email phone')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos da empresa: ${error.message}`);
    }
  }

  async getNextOrderNumber(companyId) {
    try {
      const lastOrder = await Order.findOne({ company_id: companyId })
        .sort({ order_number: -1 });

      return lastOrder ? lastOrder.order_number + 1 : 1;
    } catch (error) {
      throw new Error(`Erro ao buscar próximo número de pedido: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await OrderProduct.deleteMany({ order_id: id });
      
      await Order.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar pedido: ${error.message}`);
    }
  }
}

module.exports = new OrderRepository();