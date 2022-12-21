const Student = require('../models/student');
const Score = require('../models/score');
const Result = require('../models/result');
const Interview = require('../models/interview');
const mongoose = require('mongoose');

/*
Route            /student/add-student
Description      Renders the Add Student Page
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.addStudent = async (req, res) => {

    try{

        if(req.isAuthenticated()){
            return res.render("add_student", {
                title: "Add Student", 
                
            });
        }else{
            return res.redirect('/users/sign-in');
        }

    }catch(err){
        console.log("error in adding student --> ", err);
    }

}


/*
Route            /student/create-student
Description      Performs the operation to create a new student
Access           PUBLIC
Parameter        None
Methods          POST
*/

module.exports.createStudent = async (req, res) => {

    try{

        let {
            name,
            batch,
            email,
            age,
            gender,
            college,
            status,
            dsaScore,
            webDevScore,
            reactScore
        } = req.body;


       let user = await Student.findOne({email: req.body.email});


       if(!user){
        let student = await Student.create({

            name,
            batch,
            email,
            age: Number(age),
            gender: gender,
            college,
            status,
            interview: [],
            result: []
        });

        let score = await Score.create({
            student: student._id,
            dsaScore: Number(dsaScore),
            webDevScore: Number(webDevScore),
            reactScore: Number(reactScore)
        });

        student.course_score = score._id;

        await student.save();


        if(req.xhr){
            return res.status(200).json({
                data: {
                    student: student
                },
                message: "Student Created!"
            });
        }

        return res.redirect(`/student/show-student-details/${student._id}`);
    
    }else{

        req.flash('error', 'Student is Already Added!');
        return res.redirect("/student/student-details-list");

    }
    }catch(err){

        console.log('Error in Creating Student!!', err);
        res.redirect('back');

    }
    
}


/*
Route            /student/show-student-details
Description      Display specific student details based on student ID
Access           PUBLIC
Parameter        StudentId
Methods          GET
*/

module.exports.studentDetails = async (req, res) =>{
    try{

        let student = await Student.findOne({_id: req.params.id}).populate("course_score").populate("interview");

        if(student){
            return res.render('student_details', {
                title: 'My Page',
                student: student
            });    
        }else{

            req.flash('error', 'Student Not found!');
            console.log('Student Not Found!!', err);
            return res.redirect('back');
        }


    }catch(err){
        req.flash('error', 'Internal Server Error');
        console.log('Internal Server Error While Showing Student Details');
    }
}


/*
Route            /student/edit-student
Description      Renders the edit student page
Access           PUBLIC
Parameter        StudentId
Methods          GET
*/
module.exports.editStudent = async (req, res) => {

    try{
        let student = await Student.findById(req.params.id).populate('course_score');
        let course = await Score.findOne({_id: student.course_score})

        if(student){
            return res.render('edit-student', {
                title: "Edit Student",
                student: student,
                course: course
            });
        }else{
            req.flash('error', 'Student Not Found!');
            console.log('Student Not Found!!', err);
            return res.redirect('back');
        }

    }catch(err){

    } 
}

/*
Route            /student/update-student-details
Description      Perform an operation to edit specific student details 
Access           PUBLIC
Parameter        StudentId
Methods          POST
*/

module.exports.updateStudentDetails = async (req, res) => {

    try{

        let student = await Student.findOne({_id: req.params.id}).populate('course_score');
        let score = await Score.findOne({_id: student.course_score.id});

        if(student){
            let updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true}).populate('course_score');

            let updateScore = await Score.findByIdAndUpdate({_id: score.id}, {dsaScore: req.body.dsaScore, webDevScore: req.body.webDevScore, reactScore: req.body.reactScore}, {new: true});

            await updateScore.save();
            await updatedStudent.save();
        
            req.flash('success', 'Student Updated Successfully!!')
            return res.redirect(`/student/show-student-details/${student._id}`);
    
        }else{

            req.flash('error', 'Student Not Found!');
            console.log(`Cannot find student with the given id ${student._id}`);
            return res.redirect('back');
        }

    }catch(err){
        console.log(err);
        return;
    }

}


/*
Route            /student/delete-student
Description      Perform an operation to delete specific student
Access           PUBLIC
Parameter        StudentId
Methods          GET
*/

module.exports.deleteStudent = async (req, res) => {

    try{

    let student = await Student.findOne({_id: req.params.id});

    let result = await Result.findById(student.result);

    let interview = await Interview.findById(student.interview);
 
    if(!student){
        return res.status(200).json({
            status: "error",
            message: "Student not Found !!"
        });
    }

    if(interview){
        await interview.student.pull(student._id);
        await interview.result.pull(result._id);
        await interview.save();
    }

    if(result){
        await result.remove(); 
    }

    let course = await Score.findOne({_id: student.course_score._id});
    await Score.findByIdAndRemove(course._id);
    await Student.findByIdAndRemove(student._id);


    req.flash('success', 'Student Successfully Deleted!');
    res.redirect('back');

    }catch(err){
        console.log(err);
        return;
    }

    
}


/*
Route            /student/show-all-students-details
Description      Performs operation to display all student details who applied for a specific company interview
Access           PUBLIC
Parameter        InterviewId
Methods          GET
*/

module.exports.listStudents = async function(req, res){
    try{

        let interviewId = req.params.id;
        let interview = await Interview.findOne({_id: interviewId}).populate("student");
        let result = await Result.find({interview: interviewId}).populate('student').populate('interview');

        return res.render('all_students', {
            title: "List Of Students",
            Interview_company: interview.companyName,
            Interview_profile: interview.profile,
            Date: interview.date,
            students: interview.student,
            id: interview._id,
            result: result
        });

    }catch(err){
        console.log('Error in Listing Students', err);
    }
}


/*
Route            /student/all-details
Description      Display list of all students details along with their interview and respective result details
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.allDetails = async (req, res) => {
    try{

        let student = await Student.find({}).populate("course_score").populate('interview');
        let result = await Result.find({}).populate('student').populate('interview');

        return res.render('details', {

            title: "List Of all Students",
            student, 
            result
        });

    }catch(err){
        console.log('Error in showing all student details', err);
    }

}

/*
Route            /student/student-details-list
Description      Display list of all students along with their course scores
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.ListStudentDetails = async (req, res) => {

    try{
        if(!req.isAuthenticated()){
            return res.redirect("/");
        }
        let student = await Student.find({}).sort('-createdAt').populate("course_score").populate("interview").populate("result");
   
        return res.render("studentsList", {
            title: "List of Students",
            student: student
        });

       
    }catch(err){
        console.log("Error in displaying List of all added students! ",err)
    }
}