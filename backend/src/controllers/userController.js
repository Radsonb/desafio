const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../utils/jwt');

class UserController{
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          erro: 'Nome, email e senha são obrigatórios'
        });
      }

      const existingUser = await userRepository.findByEmail(email);
      if(existingUser) {
        return res.status(400).json({
          erro: 'Usuário já existe com este email'
        });
      }

      const user = await userRepository.create({name, email, password});

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      res.status(500).json({
        erro: error.message
      });
    }
  }

  async index(req, res) {
    try {
      const users = await userRepository.index();
      res.json(users);
    } catch (error) {
      res.status(500).json({
        erro: error.message
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await userRepository.show(id);

      if (!user) {
        return res.status(404).json({
          erro: 'Usuário não encontrado'
        });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        erro: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (req.user._id.toString() !== id) {
        return res.status(403).json({
          erro: 'Você só pode editar seu próprio perfil'
        });
      }

      const user = await userRepository.update(id, userData);

      if (!user) {
        return res.status(404).json({
          erro: 'Usuário não encontrado'
        });
      }

      res.json({
        message: 'Usuário atualizado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        erro: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (req.user._id.toString() !== id) {
        return res.status(403).json({
          erro: 'Você só pode deletar seu próprio perfil'
        });
      }

      const user = await userRepository.delete(id);

      if (!user) {
        return res.status(404).json({
          erro: 'Usuário não encontrado'
        });
      }

      res.json({
        message: 'Usuário excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        erro: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if(!email || !password) {
        return res.status(400).json({
          erro: 'Email e senha são obrigatórios'
        });
      }

      const user = await userRepository.verifyCredentials(email, password);

      const token = generateToken(user._id);

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      res.status(401).json({
        erro: error.message
      })
    }
  }

  async profile(req, res) {
    try {
      res.json({
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt
        }
      });
    } catch(error) {
      res.status(500).json({
        erro: error.message
      })
    }
  }
}

module.exports = new UserController();