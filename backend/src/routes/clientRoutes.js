const express = require('express');
const { body, param, query } = require('express-validator');
const clientController = require('../controllers/clientController');
const auth = require('../middlewares/auth');

const router = express.Router();

const createClientValidation = [
  body('company_id')
    .notEmpty()
    .withMessage('ID da empresa é obrigatório')
    .isMongoId()
    .withMessage('ID da empresa deve ser um ObjectId válido'),
  body('name')
    .notEmpty()
    .withMessage('Nome do cliente é obrigatório')
    .isLength({ min: 2, max: 30 })
    .withMessage('Nome deve ter entre 2 e 30 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage('Email deve ter no máximo 50 caracteres'),
  body('phone')
    .optional()
    .isLength({ max: 15 })
    .withMessage('Telefone deve ter no máximo 15 caracteres')
    .matches(/^[\d\s\-\(\)\+]+$/)
    .withMessage('Telefone deve conter apenas números, espaços e os símbolos: - ( ) +')
];

const updateClientValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Nome deve ter entre 2 e 30 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage('Email deve ter no máximo 50 caracteres'),
  body('phone')
    .optional()
    .isLength({ max: 15 })
    .withMessage('Telefone deve ter no máximo 15 caracteres')
    .matches(/^[\d\s\-\(\)\+]+$/)
    .withMessage('Telefone deve conter apenas números, espaços e os símbolos: - ( ) +')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID deve ser um ObjectId válido do MongoDB')
];

const searchValidation = [
  query('q')
    .notEmpty()
    .withMessage('Parâmetro de busca é obrigatório')
    .isLength({ min: 1, max: 100 })
    .withMessage('Parâmetro de busca deve ter entre 1 e 100 caracteres'),
  query('company_id')
    .notEmpty()
    .withMessage('ID da empresa é obrigatório')
    .isMongoId()
    .withMessage('ID da empresa deve ser um ObjectId válido')
];

const listValidation = [
  query('company_id')
    .optional()
    .isMongoId()
    .withMessage('ID da empresa deve ser um ObjectId válido')
];

router.post('/', auth, createClientValidation, clientController.create);
router.get('/', auth, listValidation, clientController.index);
router.get('/search', auth, searchValidation, clientController.search);
router.get('/:id', auth, idValidation, clientController.show);
router.put('/:id', auth, idValidation, updateClientValidation, clientController.update);
router.delete('/:id', auth, idValidation, clientController.delete);

module.exports = router;