const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const activityController = require('../controllers/activityController');

router.get('/', auth, activityController.getRecentActivities);

module.exports = router;