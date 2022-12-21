const mongoose = require('mongoose');

// Create Interview Schema
const interviewSchema = new mongoose.Schema({

    companyName: {
        type: String,
        required: true
    },
    profile: {
        type: String, 
      
    },
    date: {
        type: String,
        required:  true
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    result: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Result'
    }]
}, {
    timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;