const express = require('express');
const router = express.Router();

const jobList = require('../controllers/jobs_controller.js');

router.get('/list' , jobList.jobPage);

module.exports = router;