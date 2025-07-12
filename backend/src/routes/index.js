const express = require('express');
const userRoutes = require('./userRoutes');
const companyRoutes = require('./companyRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/companies', companyRoutes);

module.exports = router;