const express = require('express');
const router = express.Router();
const passport = require('passport');

const StudentController = require('../controllers/students_controller');

router.get('/add-student', passport.checkAuthentication,StudentController.addStudent);
router.post('/create-student', passport.checkAuthentication,StudentController.createStudent);
router.get('/show-student-details/:id',passport.checkAuthentication, StudentController.studentDetails);
router.get('/show-all-students-details/:id', passport.checkAuthentication,StudentController.listStudents);
router.get('/edit-student/:id', passport.checkAuthentication, StudentController.editStudent);
router.post('/update-student-details/:id', passport.checkAuthentication, StudentController.updateStudentDetails);
router.get('/all-details',passport.checkAuthentication, StudentController.allDetails);
router.get('/student-details-list', passport.checkAuthentication, StudentController.ListStudentDetails);
router.get('/delete-student/:id', passport.checkAuthentication, StudentController.deleteStudent);

module.exports = router;