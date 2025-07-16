const orderRepository = require('../repositories/orderRepository');
const companyRepository = require('../repositories/companyRepository');
const clientRepository = require('../repositories/clientRepository');
const productRepository = require('../repositories/productRepository');
const { validationResult } = require('express-validator');

class OrderController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { company_id, client_id, notes, products } = req.body;

      const company = await companyRepository.show(company_id);
      if (!company) return res.status(404).json({ erro: 'Emprpesa não encontrada' });

      if (company.user_id.toString() !== req.user.id) return res.status(401).json({ erro: 'Acesso negado - usuário não vinculado a empresa' });

      const client = await clientRepository.show(client_id);
      if (!client) return res.status(404).json({ erro: 'Cliente não encotnrado' });

      for (const item of products) {
        const product = await productRepository.show(item.product_id);
        if (!product) return res.status(404).json({ erro: `Produto ${item.product_id} não encontrado` });

        if (product.company_id._id.toString() !== company_id) return res.status(409).json({ erro: `Produto ${product.name} não pertence a esta empresa` });
      }

      const orderNumber = await orderRepository.getNextOrderNumber(company_id);

      const orderData = {
        company_id,
        client_id,
        order_number: orderNumber,
        notes,
        status: 'pending'
      };

      const order = await orderRepository.create(orderData);

      await orderRepository.addProductsToOrder(order._id, products);

      const fullOrder = await orderRepository.show(order._id);

      res.status(201).json({
        message: 'Pedido criado com sucesso',
        order: fullOrder
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        details: error.message
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const order = await orderRepository.show(id);

      if (!order) {
        return res.status(404).json({
          erro: 'Pedido não encontrado'
        });
      }

      const company = await companyRepository.show(order.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  async index(req, res) {
    try {
      const { company_id, client_id, status } = req.query;

      if (company_id) {
        const company = await companyRepository.show(company_id);
        if (!company) {
          return res.status(404).json({
            erro: 'Empresa não encontrada'
          });
        }

        if (company.user_id._id.toString() !== req.user.id) {
          return res.status(403).json({
            erro: 'Acesso negado'
          });
        }

        let orders = await orderRepository.findByCompanyId(company_id);

        if (status) {
          orders = orders.filter(order => order.status === status);
        }

        return res.json(orders);
      }

      if (client_id) {
        const orders = await orderRepository.findByClientId(client_id);
        
        for (const order of orders) {
          const company = await companyRepository.show(order.company_id._id);
          if (company.user_id._id.toString() !== req.user.id) {
            return res.status(403).json({
              erro: 'Acesso negado'
            });
          }
        }

        return res.json(orders);
      }

      const userCompanies = await companyRepository.findByUserId(req.user.id);
      
      if (!Array.isArray(userCompanies) || userCompanies.length === 0) {
        return res.json([]);
      }

      const allOrders = [];
      for (const company of userCompanies) {
        let orders = await orderRepository.findByCompanyId(company._id);
        
        if (status) {
          orders = orders.filter(order => order.status === status);
        }

        allOrders.push(...orders);
      }

      allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json(allOrders);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          detalhes: errors.array()
        });
      }

      const { id } = req.params;
      const { notes, status, products } = req.body;

      const existingOrder = await orderRepository.show(id);
      if (!existingOrder) {
        return res.status(404).json({
          erro: 'Pedido não encontrado'
        });
      }

      const company = await companyRepository.show(existingOrder.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      const updateData = {};
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined) updateData.status = status;

      await orderRepository.update(id, updateData);

      if (products && Array.isArray(products)) {
        for (const item of products) {
          const product = await productRepository.show(item.product_id);
          if (!product) {
            return res.status(404).json({
              erro: `Produto ${item.product_id} não encontrado`
            });
          }

          if (product.company_id._id.toString() !== existingOrder.company_id._id.toString()) {
            return res.status(400).json({
              erro: `Produto ${product.name} não pertence a esta empresa`
            });
          }
        }

        await orderRepository.updateOrderProducts(id, products);
      }

      const updatedOrder = await orderRepository.show(id);

      res.json({
        message: 'Pedido atualizado com sucesso',
        order: updatedOrder
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingOrder = await orderRepository.show(id);
      if (!existingOrder) {
        return res.status(404).json({
          erro: 'Pedido não encontrado'
        });
      }

      const company = await companyRepository.show(existingOrder.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      await orderRepository.delete(id);

      res.json({
        message: 'Pedido deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

module.exports = new OrderController();