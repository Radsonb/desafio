const express = require('express');
const { body, param, query } = require('express-validator');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

const router = express.Router();

const createProductValidation = [
  body('company_id')
    .notEmpty()
    .withMessage('ID da empresa é obrigatório')
    .isMongoId()
    .withMessage('ID da empresa deve ser um ObjectId válido'),
  body('name')
    .notEmpty()
    .withMessage('Nome do produto é obrigatório')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s\-_.,()]+$/)
    .withMessage('Nome pode conter apenas letras, números, espaços e pontuação básica'),
  body('value')
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Valor deve ser maior ou igual a 0'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Descrição deve ter no máximo 200 caracteres')
];

const updateProductValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s\-_.,()]+$/)
    .withMessage('Nome pode conter apenas letras, números, espaços e pontuação básica'),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Valor deve ser maior ou igual a 0'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Descrição deve ter no máximo 200 caracteres')
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

router.post('/', auth, createProductValidation, productController.create);
router.get('/', auth, listValidation, productController.index);
router.get('/search', auth, searchValidation, productController.search);
router.get('/:id', auth, idValidation, productController.show);
router.put('/:id', auth, idValidation, updateProductValidation, productController.update);
router.delete('/:id', auth, idValidation, productController.delete);

module.exports = router;