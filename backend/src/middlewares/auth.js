const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        erro: 'Token de acesso não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        erro: 'Token inválido - usuário não encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) { 
    if(error.name === 'TokenExpiredError') {
      return res.status(401).json({
        erro: 'Token expirado'
      });
    }

    if(error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        erro: 'Token inválido'
      });
    }

    res.status(500).json({
      erro: 'Erro no servidor de autenticação'
    })
  }
}

module.exports = auth;