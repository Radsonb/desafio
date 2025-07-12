const { Product } = require('../../database/models');

class ProductRepository {
  async create(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch(error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  async show(id) {
    try {
      return await Product.findById(id).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar produto por ID: ${error.message}`);
    }
  }

  async findByCompanyId(companyId) {
    try {
      return await Product.find({ company_id: companyId }).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar produtos da empresa: ${error.message}`);
    }
  }

  async findByName(name, companyId) {
    try {
      return await Product.findOne({ 
        name: { $regex: name, $options: 'i' }, 
        company_id: companyId 
      });
    } catch(error) {
      throw new Error(`Erro ao buscar produto por nome: ${error.message}`);
    }
  }

  async index() {
    try {
      return await Product.find({}).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar todos os produtos: ${error.message}`);
    }
  }

  async update(id, productData) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      ).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch(error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  async search(query, companyId) {
    try {
      const searchRegex = { $regex: query, $options: 'i' };
      return await Product.find({
        company_id: companyId,
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).populate('company_id', 'fantasy_name razao_social');
    } catch(error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
  }
}

module.exports = new ProductRepository();