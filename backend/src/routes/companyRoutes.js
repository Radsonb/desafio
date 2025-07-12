const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const auth = require('../middlewares/auth');

const router = express.Router();

const createCompanyValidation = [
  body('fantasy_name')
    .notEmpty()
    .withMessage('Nome fantasia é obrigatório')
    .isLength({ max: 30 })
    .withMessage('Nome fantasia deve ter no máximo 30 caracteres'),
  body('razao_social')
    .notEmpty()
    .withMessage('Razão social é obrigatória')
    .isLength({ max: 50 })
    .withMessage('Razão social deve ter no máximo 50 caracteres'),
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX')
];

const updateCompanyValidation = [
  body('fantasy_name')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Nome fantasia deve ter no máximo 30 caracteres'),
  body('razao_social')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Razão social deve ter no máximo 50 caracteres'),
  body('cnpj')
    .optional()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX')
];

router.post('/', auth, createCompanyValidation, companyController.create);
router.get('/', auth, companyController.index);
router.get('/:id', auth, companyController.show);
router.put('/:id', auth, updateCompanyValidation, companyController.update);
router.delete('/:id', auth, companyController.delete);

module.exports = router;
