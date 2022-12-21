const Student = require('../models/student');
const Interview = require('../models/interview');
const Result = require('../models/result');
const {Parser} = require('json2csv');


/*
Route            /csv/downloadcsv
Description      performs the operation to download report in CSV format
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.downloadCSV = async function(req,res){
    try{
        
        let students = await Student.find({}).populate("course_score").populate('interview');
        let result = await Result.find({}).populate('student').populate('interview');

        //Convert Data to json
        let exportData = [];

        for(students of students){

            let i = students.interview.length - 1;
            let obj ={};

            while(i >= 0){

                obj['StudentID'] = students._id;
                obj['StudentName'] = students.name;
                obj['StudentBatch'] = students.batch;
                obj['StudentEmail'] = students.email;
                obj['StudentAge'] = students.age,
                obj['StudentGender'] = students.gender,
                obj['StudentCollege'] = students.college;
                obj['StudentStatus'] = students.status;
                obj['DSAScore'] = students.course_score.dsaScore;
                obj['WebdScore'] = students.course_score.webDevScore;
                obj['ReactScore'] = students.course_score.reactScore;
                obj['InterviewCompany'] = students.interview[i].companyName;
                obj['InterviewProfile'] = students.interview[i].profile;
                obj['InterviewDate'] = students.interview[i].date;

                let data = "";

                for(let j=0; j<result.length; j++) { 
                     
                    
                if((result[j].student._id.equals(students._id)) && (result[j].interview._id.equals(students.interview[i]._id))) { 
                        
                   data = result[j].result;
                 } 
             } 
    
             obj['InterviewResult'] = data;
             i--;
             exportData.push(obj);

            }
        }
        

        const fields = ['StudentID','StudentName', 'StudentBatch', 'StudentEmail', 'StudentAge', 'StudentGender',  'StudentCollege','StudentStatus','DSAScore','WebdScore', 'ReactScore','InterviewCompany','InterviewProfile', 'InterviewDate','InterviewResult'];

        const opts = {fields};

        //Parse the json to csv
        const parser = new Parser(opts);
        const csv = parser.parse(exportData);

        res.attachment('results.csv');
        res.status(200).send(csv);
        req.flash('success', 'CSV File Downloaded Successfully!');
    }catch(err){
        console.log('*** Error in Exporting the CSV of data controller ***',err);
       
    }
}