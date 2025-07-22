const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const auth = require('../middlewares/auth');
const { validateCNPJ, validateCompanyName } = require('../utils/validators');

const router = express.Router();

const cnpjValidator = body('cnpj')
  .notEmpty()
  .withMessage('CNPJ é obrigatório')
  .custom(async (value) => {
    if (!validateCNPJ(value)) {
      throw new Error('CNPJ inválido. Verifique os dígitos verificadores.');
    }
    return true;
  });

const companyNameValidator = body('fantasy_name')
  .notEmpty()
  .withMessage('Nome fantasia é obrigatório')
  .isLength({ min: 2, max: 30 })
  .withMessage('Nome fantasia deve ter entre 2 e 30 caracteres')
  .custom(async (value) => {
    if (!validateCompanyName(value)) {
      throw new Error('Nome fantasia contém caracteres inválidos');
    }
    return true;
  });

const createCompanyValidation = [
  companyNameValidator,
  body('razao_social')
    .notEmpty()
    .withMessage('Razão social é obrigatória')
    .isLength({ min: 2, max: 50 })
    .withMessage('Razão social deve ter entre 2 e 50 caracteres')
    .custom(async (value) => {
      if (!validateCompanyName(value)) {
        throw new Error('Razão social contém caracteres inválidos');
      }
      return true;
    }),
  cnpjValidator
];

const updateCompanyValidation = [
  body('fantasy_name')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Nome fantasia deve ter entre 2 e 30 caracteres')
    .custom(async (value) => {
      if (value && !validateCompanyName(value)) {
        throw new Error('Nome fantasia contém caracteres inválidos');
      }
      return true;
    }),
  body('razao_social')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Razão social deve ter entre 2 e 50 caracteres')
    .custom(async (value) => {
      if (value && !validateCompanyName(value)) {
        throw new Error('Razão social contém caracteres inválidos');
      }
      return true;
    }),
  body('cnpj')
    .optional()
    .custom(async (value) => {
      if (value && !validateCNPJ(value)) {
        throw new Error('CNPJ inválido. Verifique os dígitos verificadores.');
      }
      return true;
    })
];

router.post(
  '/',
  auth,
  createCompanyValidation,
  companyController.create
);

router.get(
  '/:id',
  auth,
  companyController.show
);

router.put(
  '/:id',
  auth,
  updateCompanyValidation,
  companyController.update
);

router.delete(
  '/:id',
  auth,
  companyController.delete
);

router.get(
  '/',
  auth,
  companyController.index
);

module.exports = router;
