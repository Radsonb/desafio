const express = require('express');
const userRoutes = require('./userRoutes');
const companyRoutes = require('./companyRoutes');
const productRoutes = require('./productRoutes');
const clientRoutes = require('./clientRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);

module.exports = router;