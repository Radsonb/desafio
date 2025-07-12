const { Company } = require("../../database/models");

class CompanyRepository {
  async create(companyData) {
    try {
      const company = new Company(companyData);
      return await company.save();
    } catch(error) {
      throw new Error(`Erro ao criar empresa: ${error.message}`);
    }
  }

  async show(id) {
    try {
      return await Company.findById(id);
    } catch(error) {
      throw new Error(`Erro ao buscar empresa por ID: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      return await Company.findOne({ user_id: userId });
    } catch(error) {
      throw new Error(`Erro ao buscar empresa por usuário: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Company.findOne({ _id: id });
    } catch(error) {
      throw new Error(`Erro ao buscar empresa por CNPJ: ${error.message}`);
    }
  }

  async findByCnpj(cnpj) {
    try {
      return await Company.findOne({ cnpj });
    } catch(error) {
      throw new Error(`Erro ao buscar empresa por CNPJ: ${error.message}`);
    }
  }

  async update(id, companyData) {
    try {
      return await Company.findByIdAndUpdate(
        id, 
        companyData,
        { new: true, runValidators: true}
      ).populate('user_id', 'name email');
    } catch(error) {
      throw new Error(`Erro ao atualizar empresa: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await Company.findByIdAndDelete(id);
    } catch(error) {
      throw new Error(`Erro ao deletar empresa: ${error.message}`);
    }
  }
} 

module.exports = new CompanyRepository();