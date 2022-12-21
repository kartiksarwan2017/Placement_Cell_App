const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
console.log('Router Loaded');

router.use('/users', require('./users'));
router.use('/student', require('./student'));
router.use('/interview', require('./interview'));
router.use('/jobs', require('./jobs'));
router.use('/csv', require('./csv'));
router.get('/', homeController.home);
module.exports = router;