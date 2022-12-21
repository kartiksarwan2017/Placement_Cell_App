const express = require('express');
const passport = require('passport');

const router = express.Router();
const interviewController = require('../controllers/interview_controller');


router.get('/list-interview-page', passport.checkAuthentication,interviewController.listInterviewPage);

router.get('/add-interview',passport.checkAuthentication, interviewController.addInterview);
router.post('/create-interview', passport.checkAuthentication, interviewController.createInterview);

router.get('/schedule-interview/:id', passport.checkAuthentication, interviewController.scheduleInterview);

router.post('/add-student-interview/:id', passport.checkAuthentication, interviewController.addStudentInterview);

router.post("/save-result/:interviewID/:studentID", passport.checkAuthentication, interviewController.updateResult);

router.get('/destroy/:id', passport.checkAuthentication, interviewController.destroy);

router.get('/delete-student/:id', passport.checkAuthentication, interviewController.deleteStudent);

module.exports = router;


