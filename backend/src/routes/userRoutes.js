const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', userController.create);
router.post('/login', userController.login);

router.get('/profile', auth, userController.profile);
router.get('/', auth, userController.index);
router.get('/:id', auth, userController.show);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.delete);


module.exports = router;