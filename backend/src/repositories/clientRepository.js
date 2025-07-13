const { Client } = require('../../database/models');

class ClientRepository {
  async create(clientData) {
    try {
      const client = new Client(clientData);
      return await client.save();
    } catch(error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  async show(id) {
    try {
      return await Client.findById(id).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar cliente por ID: ${error.message}`);
    }
  }

  async findByCompanyId(companyId) {
    try {
      return await Client.find({ company_id: companyId }).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar clientes da empresa: ${error.message}`);
    }
  }

  async findByEmail(email, companyId) {
    try {
      return await Client.findOne({ 
        email: email.toLowerCase(), 
        company_id: companyId 
      });
    } catch(error) {
      throw new Error(`Erro ao buscar cliente por email: ${error.message}`);
    }
  }

  async findByPhone(phone, companyId) {
    try {
      return await Client.findOne({ 
        phone, 
        company_id: companyId 
      });
    } catch(error) {
      throw new Error(`Erro ao buscar cliente por telefone: ${error.message}`);
    }
  }

  async index() {
    try {
      return await Client.find({}).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar todos os clientes: ${error.message}`);
    }
  }

  async update(id, clientData) {
    try {
      return await Client.findByIdAndUpdate(
        id,
        clientData,
        { new: true, runValidators: true }
      ).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await Client.findByIdAndDelete(id);
    } catch(error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  }

  async search(query, companyId) {
    try {
      const searchRegex = { $regex: query, $options: 'i' };
      return await Client.find({
        company_id: companyId,
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      }).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }
}

module.exports = new ClientRepository();