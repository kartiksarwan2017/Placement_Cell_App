const mongoose = require('mongoose');

// Create ResultSchema
const resultSchema = new mongoose.Schema({

    result: {
        type: String,
        enum: ["Selected", "Not Selected", "On Hold", "Absent", "Interview Pending"],
        trim: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }
}, {
    timestamps: true
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;