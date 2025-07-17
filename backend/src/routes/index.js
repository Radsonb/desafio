const express = require('express');
const userRoutes = require('./userRoutes');
const companyRoutes = require('./companyRoutes');
const productRoutes = require('./productRoutes');
const clientRoutes = require('./clientRoutes');
const orderRoutes = require('./orderRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const activityRoutes = require('./activityRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activities', activityRoutes);

module.exports = router;