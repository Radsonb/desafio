const clientRepository = require('../repositories/clientRepository');
const companyRepository = require('../repositories/companyRepository');
const { validationResult } = require('express-validator');

class ClientController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          details: errors.array()
        })
      }

      const { company_id, name, email, phone } = req.body;

      const company = await companyRepository.show(company_id);
      if (!company) {
        return res.status(404).json({
          erro: 'Empresa não encontrada'
        });
      }

      if(company.user_id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      const existingClientByEmail = await clientRepository.findByEmail(email, company_id);
      if (existingClientByEmail) {
        return res.status(409).json({
          erro: 'Já existe um cliente com este email nesta empresa'
        });
      }

      const existingClientByPhone = await clientRepository.findByPhone(phone, company_id);
      if (existingClientByPhone) {
        return res.status(409).json({
          erro: 'Já existe um cliente com este telefone nesta empresa'
        });
      }

      const clientData = {
        company_id,
        name,
        email,
        phone
      }

      const client = await clientRepository.create(clientData);

      res.status(201).json({
        message: 'Cliente criado com sucesso',
        client: {
          id: client._id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          company_id: client.company_id
        }
      })
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
      const client = await clientRepository.show(id);

      if (!client) {
        return res.status(404).json({
          erro: 'Cliente não encontrado'
        });
      }

      const company = await companyRepository.show(client.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
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

        if (company.user_id._id.toString() !== req.user.id) {
          return res.status(403).json({
            erro: 'Acesso negado'
          });
        }

        const clients = await clientRepository.findByCompanyId(company_id);
        return res.json(clients);
      }

      const userCompanies = await companyRepository.findByUserId(req.user.id);
      
      if (!Array.isArray(userCompanies) || userCompanies.length === 0) {
        return res.json([]);
      }

      const allClients = [];
      for (const company of userCompanies) {
        const clients = await clientRepository.findByCompanyId(company._id);
        allClients.push(...clients);
      }

      res.json(allClients);
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
      const { name, email, phone } = req.body;

      const existingClient = await clientRepository.show(id);
      if (!existingClient) {
        return res.status(404).json({
          erro: 'Cliente não encontrado'
        });
      }

      const company = await companyRepository.show(existingClient.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      if (email && email !== existingClient.email) {
        const emailExists = await clientRepository.findByEmail(email, existingClient.company_id._id);
        if (emailExists) {
          return res.status(400).json({
            erro: 'Já existe um cliente com este email nesta empresa'
          });
        }
      }

      if (phone && phone !== existingClient.phone) {
        const phoneExists = await clientRepository.findByPhone(phone, existingClient.company_id._id);
        if (phoneExists) {
          return res.status(400).json({
            erro: 'Já existe um cliente com este telefone nesta empresa'
          });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;

      const client = await clientRepository.update(id, updateData);

      res.json({
        message: 'Cliente atualizado com sucesso',
        client
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

      const existingClient = await clientRepository.show(id);
      if (!existingClient) {
        return res.status(404).json({
          erro: 'Cliente não encontrado'
        });
      }

      const company = await companyRepository.show(existingClient.company_id._id);
      if (company.user_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          erro: 'Acesso negado'
        });
      }

      await clientRepository.delete(id);

      res.json({
        message: 'Cliente deletado com sucesso'
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

      const clients = await clientRepository.search(query, company_id);

      res.json(clients);
    } catch (error) {
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

module.exports = new ClientController();