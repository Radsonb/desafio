const express = require('express');
const { body, param, query } = require('express-validator');
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

const router = express.Router();

const createOrderValidation = [
  body('company_id')
    .notEmpty()
    .withMessage('ID da empresa é obrigatório')
    .isMongoId()
    .withMessage('ID da empresa deve ser um ObjectId válido'),
  body('client_id')
    .notEmpty()
    .withMessage('ID do cliente é obrigatório')
    .isMongoId()
    .withMessage('ID do cliente deve ser um ObjectId válido'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('Produtos devem ser um array com pelo menos 1 item'),
  body('products.*.product_id')
    .notEmpty()
    .withMessage('ID do produto é obrigatório')
    .isMongoId()
    .withMessage('ID do produto deve ser um ObjectId válido'),
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que 0'),
  body('notes')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Observações devem ter no máximo 200 caracteres')
];

const updateOrderValidation = [
  body('notes')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Observações devem ter no máximo 200 caracteres'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])
    .withMessage('Status deve ser um dos valores: pending, confirmed, preparing, delivered, cancelled'),
  body('products')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Produtos devem ser um array com pelo menos 1 item'),
  body('products.*.product_id')
    .optional()
    .isMongoId()
    .withMessage('ID do produto deve ser um ObjectId válido'),
  body('products.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que 0')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID deve ser um ObjectId válido do MongoDB')
];

const listValidation = [
  query('company_id')
    .optional()
    .isMongoId()
    .withMessage('ID da empresa deve ser um ObjectId válido'),
  query('client_id')
    .optional()
    .isMongoId()
    .withMessage('ID do cliente deve ser um ObjectId válido'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])
    .withMessage('Status deve ser um dos valores: pending, confirmed, preparing, delivered, cancelled')
];

router.post('/', auth, createOrderValidation, orderController.create);
router.get('/', auth, listValidation, orderController.index);
router.get('/:id', auth, idValidation, orderController.show);
router.put('/:id', auth, idValidation, updateOrderValidation, orderController.update);
router.delete('/:id', auth, idValidation, orderController.delete);

module.exports = router;