const Interview = require("../models/interview");
const Student = require("../models/student");
const Result = require("../models/result");

/*
Route            /interview/list-interview-page
Description      Display list of all interviews
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.listInterviewPage = async function (req, res) {
  try {
    let interviews = await Interview.find({}).sort("-createdAt");
    let student = await Student.find({});

    return res.render("all_interview", {
      title: "List Of Interviews",
      interview: interviews,
      student: student,
    });
  } catch (err) {
    console.log("Error in listing Interview!!", err);
  }
};

/*
Route            /interview/add-interview
Description      Renders the add interview page
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.addInterview = async (req, res) => {
  try {
    return res.render("add_interview", {
      title: "Add Interview",
    });
  } catch (err) {
    console.log("Error in Adding Interview ", err);
  }
};

/*
Route            /interview/create-interview
Description      Performs operation to create interview slot
Access           PUBLIC
Parameter        None
Methods          POST
*/

module.exports.createInterview = async (req, res) => {
  try {
    let company = await Interview.findOne({
      companyName: req.body.company_name,
    });

    if (!company) {
      let interview = await Interview.create({
        companyName: req.body.company_name,
        profile: req.body.profile,
        date: req.body.interview_date,
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            interview: interview,
          },
          message: "Interview Slot Created!",
        });
      }

      console.log("Interview Added Successfully");
      return res.redirect("/interview/list-interview-page");
    } else {
      console.log("interview is already added");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in Creating Interview!", err);
    return res.redirect("back");
  }
};

/*
Route            /interview/schedule-interview
Description      Renders the Schedule Interview Page
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.scheduleInterview = async (req, res) => {
  try {
    let InterviewId = req.params.id;
    let interview = await Interview.find({ _id: InterviewId });
    let student = await Student.find({});

    if (interview) {
      return res.render("schedule_interview", {
        title: "Placement | Schedule Interview",
        interview,
        student: student,
      });
    }
  } catch (err) {
    console.log("Error in Scheduling Interview!!", err);
    return res.redirect("back");
  }
};

/*
Route            /interview/add-student-interview
Description      Performs operation to Schedule Interview of Student
Access           PUBLIC
Parameter        InterviewId
Methods          POST
*/

module.exports.addStudentInterview = async (req, res) => {
  try {
    let interviewId = req.params.id;
    let stuID = req.body.student;

    let schInterview = await Interview.findOne({ _id: interviewId });
    let stu = await Student.findOne({ _id: stuID });
    let result = await Result.create({
      interview: schInterview._id,
      student: stu._id,
    });

    if (schInterview) {
      stu.interview.push(schInterview._id);
      stu.result.push(result._id);
      await stu.save();

      schInterview.result.push(result._id);
      schInterview.student.push(stu._id);
      await schInterview.save();

      if (req.xhr) {
        return res.status(200).json({
          data: {
            schInterview: schInterview,
          },
          message: "Interview Slot Created!",
        });
      }
    }

    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};

/*
Route            /interview/destroy
Description      Performs operation to delete the interview slot
Access           PUBLIC
Parameter        InterviewId
Methods          GET
*/

module.exports.destroy = async (req, res) => {
  // find if the interview slots exists or not
  try {
    let interview = await Interview.findById(req.params.id)
      .populate("student")
      .populate("result");
    // console.log("interview", interview);

    if (!interview) {
      return res.status(200).json({
        status: "error",
        message: "Interview Slot Not found!!",
      });
    }

    for (let i = 0; i < interview.student.length; i++) {
      let student = [];
      student[i] = await Student.findById(interview.student[i]);
      // console.log("student", student[i]);

      if (student[i]) {
        // update student and delete interview slot
        student[i].interview.pull(interview._id);
        await student[i].save();
      }

      let result;
      result = await Result.findById(interview.result[i]);
      // console.log("result", result);

      if (result) {
        student[i].result.pull(result._id);
        await student[i].save();
        await result.remove();
      }
    }

    await interview.remove();
    req.flash("success", "Interview Slot Deleted Successfully!");
    return res.redirect("back");
    
  } catch (err) {
    console.log(err);
  }
};

/*
Route            /interview/delete-student
Description      Performs operation to delete the student from the interview slot
Access           PUBLIC
Parameter        InterviewId
Methods          GET
*/

module.exports.deleteStudent = async (req, res) => {
  try {
    // find the interview slot
    let interview = await Interview.findById(req.params.id);

    let student = await Student.findById(interview.student);

    if (interview) {
      interview.student.pull(student._id);

      await interview.save();

      student.interview.pull(interview._id);
      await student.save();
    } else {
      return res.status(200).json({
        status: "error",
        message: "Interview Slot not Found!!",
      });
    }

    let resultId = await Result.findById(interview.result);

    if (resultId) {
      student.result.pull(resultId);
      await student.save();

      interview.result.pull(resultId);
      await interview.save();
      resultId.remove();
    }
    req.flash("success", "Student Successfully Deleted!");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};

/*
Route            /interview/save-result
Description      Performs operation to delete the student from the interview slot
Access           PUBLIC
Parameter        InterviewId  StudentId
Methods          POST
*/

module.exports.updateResult = async (req, res) => {
  try {
    let Stud = await Student.findOne({ student: req.params.studentID });

    let r = await Result.findOne({
      student: req.params.studentID,
      interview: req.params.interviewID,
    });

    if (!r) {
      try {
        await Result.create({
          result: req.body.resultStatus,
          student: r.student._id,
          interview: r.interview._id,
          student: Stud,
        });

        req.flash("success", "Result Updated Sucessfully!");
        return res.redirect("back");
      } catch (err) {
        console.log("Error in creating Result");
        return;
      }
    } else {
      r.result = req.body.resultStatus;
      await r.save();

      req.flash("success", "Result Updated Sucessfully!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in saving data", err);
  }
};
