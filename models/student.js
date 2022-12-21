const mongoose = require('mongoose');

// Create StudentSchema
const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Name Must be at least 3 characters long"],

    },
    batch: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        min: [18, "Age must be atleast 18 Years Old"],
        max: [60, "Age must be at most 60 years old"]
    },
    gender: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
        trim: true,
        minlength: 1

    },
    status: {
        type: String,
        default: "Not Placed",
        enum: ["Placed", "Not Placed"]
    },
    course_score: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Score"

    },
    result: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Result'
    }],
    interview: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }
]
}, {
    timestamps: true
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;