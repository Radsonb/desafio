const productRepository = require('../repositories/productRepository');
const companyRepository = require('../repositories/companyRepository');
const { validationResult } = require('express-validator');

class ProductController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          details: errors.array()
        })
      }

      const { company_id, name, value, description } = req.body;

      const company = await companyRepository.show(company_id);
      if (!company) {
        return res.status(404).json({
          erro: 'Empresa não encontrada'
        });
      }

      if (company.user_id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Usuário não autorizado a criar produto para esta empresa'
        });
      }

      const existingProduct = await productRepository.findByName(name, company_id);
      if (existingProduct) {
        return res.status(409).json({
          erro: 'Já existe um produto com este nome nesta empresa'
        });
      }

      const productData = {
        company_id,
        name,
        value,
        description
      }
      const product = await productRepository.create(productData);

      res.status(201).json({
        message: 'Produto criado com sucesso',
        product
      })
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        details: error.message
      })
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const product = await productRepository.show(id);

      if (!product) {
        return res.status(404).json({
          erro: 'Produto não encontrado'
        });
      }

      const company = await companyRepository.show(product.company_id);
      if (company.user_id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        details: error.message
      });
    }
  }

  async index(req, res) {
    try {
      const { company_id } = req.query;

      if (company_id) {
        const company = await companyRepository.show(company_id);
        if (!company) {
          return res.status(404).json({
            erro: 'Empresa não encontrada'
          });
        }

        if (company.user_id.toString() !== req.user.id) {
          return res.status(403).json({
            erro: 'Acesso negado'
          });
        }

        const products = await productRepository.findByCompanyId(company_id);
        return res.json(products);
      }

      const userCompanies = await companyRepository.findByUserId(req.user.id);
      if (!Array.isArray(userCompanies || userCompanies.length === 0)) {
        return res.json([]);
      }
      
      const companyIds = userCompanies.map(company => company._id);

      const allProducts = [];
      for (const companyId of companyIds) {
        const products = await productRepository.findByCompanyId(companyId);
        allProducts.push(...products);
      }

      res.json(allProducts);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        details: error.message
      })
    } 
  }

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const { name, value, description } = req.body;

      const existingProduct = await productRepository.show(id);
      if (!existingProduct) {
        return res.status(404).json({
          erro: 'Produto não encontrado'
        });
      }

      const company = await companyRepository.show(existingProduct.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      if (name && name !== existingProduct.name) {
        const nameExists = await productRepository.findByName(name, existingProduct.company_id._id);
        if (nameExists) {
          return res.status(400).json({
            erro: 'Já existe um produto com este nome nesta empresa'
          });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (value !== undefined) updateData.value = value;
      if (description !== undefined) updateData.description = description;

      const product = await productRepository.update(id, updateData);

      res.json({
        message: 'Produto atualizado com sucesso',
        product
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

      const existingProduct = await productRepository.show(id);
      if (!existingProduct) {
        return res.status(404).json({
          erro: 'Produto não encontrado'
        });
      }

      const company = await companyRepository.show(existingProduct.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      await productRepository.delete(id);

      res.json({
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  async search(req, res) {
    try {
      const { q: query, company_id } = req.query;

      if (!query) {
        return res.status(400).json({
          erro: 'Parâmetro de busca é obrigatório'
        });
      }

      if (!company_id) {
        return res.status(400).json({
          erro: 'ID da empresa é obrigatório para busca'
        });
      }

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

      const products = await productRepository.search(query, company_id);

      res.json(products);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

module.exports = new ProductController();