const companyRepository = require('../repositories/companyRepository');
const { validationResult} = require('express-validator')

class CompanyController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { fantasy_name, razao_social, cnpj } = req.body;

      const existingCompany = await companyRepository.findByCnpj(cnpj);
      if (existingCompany) {
        return res.status(409).json({
          erro: 'CNPJ já está sendo usado por outra empresa'
        });
      }

      const companyData = {
        user_id: req.user._id,
        fantasy_name,
        razao_social,
        cnpj
      }
      
      const company = await companyRepository.create(companyData);

      res.status(201).json({
        message: 'Empresa criada com sucesso',
        company
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
      const company = await companyRepository.show(id);

      if (!company) {
        return res.status(404).json({
          erro: 'Empresa não encontrada'
        });
      }

      if(company.user_id.toString() !== req.user.id) {
        return res.status(401).json({
          erro: 'Acesso negado'
        });
      }

      res.json(company)
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        details: error.message
      })
    }
  }

  async index(req, res) {
    try {
      const companies = await companyRepository.findByUserId(req.user.id);
      res.json(companies || []);
    } catch(error) {
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
        });
      }

      const { id } = req.params;
      const { fantasy_name, razao_social, cnpj } = req.body;

      const existingCompany = await companyRepository.findById(id);
      if (!existingCompany) {
        return res.status(404).json({
          erro: 'Empresa não encontrada'
        });
      }

      if (existingCompany.user_id._id.toString() !== req.user.id) {
        return res.status(401).json({
          erro: 'Acesso negado'
        });
      }

      const updateData = {};
      if (fantasy_name) updateData.fantasy_name = fantasy_name;
      if (razao_social) updateData.razao_social = razao_social;
      if (cnpj) updateData.cnpj = cnpj;

      const company = await companyRepository.update(id, updateData);

      res.json({
        message: 'Empresa atualizada com sucesso',
        company
      })
    } catch(error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        details: error.message
      })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const existingCompany = await companyRepository.show(id);

      if (!existingCompany) {
        return res.status(404).json({
          erro: 'Empresa não encontrada'
        });
      }

      if (existingCompany.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      await companyRepository.delete(id);

      res.json({
        message: 'Empresa deletada com sucesso'
      });
    } catch(error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

module.exports = new CompanyController();