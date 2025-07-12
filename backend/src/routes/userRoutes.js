const express = require('express');
const userController = require('../controllers/userController');
const { body, param } = require('express-validator');
const auth = require('../middlewares/auth');

const router = express.Router();

const createUserValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email deve ter no máximo 100 caracteres'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
];

const updateUserValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email deve ter no máximo 100 caracteres'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID deve ser um ObjectId válido do MongoDB')
];

router.post('/', createUserValidation,userController.create);
router.post('/login', loginValidation, userController.login);

router.get('/profile', auth, userController.profile);
router.get('/', auth, userController.index);
router.get('/:id', auth, idValidation, userController.show);
router.put('/:id', auth, idValidation, updateUserValidation, userController.update);
router.delete('/:id', auth, idValidation, userController.delete);


module.exports = router;