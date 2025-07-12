const { User } = require("../../database/models");

class UserRepository {
  async create(userData) {
    console.log(userData);
    try {
      const user = new User(userData);
      return await user.save();
    } catch(error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async show(id) {
    try {
      return await User.findById(id);
    } catch(error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch(error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  async index() {
    try {
      return await User.find({}).select('-password');
    } catch(error) {
      throw new Error(`Erro ao buscar todos os usuários: ${error.message}`);
    }
  }

  async update(id, userData) {
    try {
      return await User.findByIdAndUpdate(
        id,
        userData,
        { new: true, runValidators: true }
      ).select('-password');
    } catch(error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await User.findByIdAndDelete(id);
    } catch(error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  async verifyCredentials(email, password) {
    try {
      const user = await User.findOne({ email });
      if(!user) {
        throw new Error('Usuário não encontrado');
      }

      const isPasswordValid = await user.comparePassword(password);
      if(!isPasswordValid) {
        throw new Error('Senha inválida');
      }

      return user;
    } catch (error) {
      throw new Error(`Erro na autenticação: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();