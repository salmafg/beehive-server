var mongoose = require('mongoose');

var activity = new mongoose.Schema({
    annotatedImageCount: {
        type: Number,
        default: 0
    },
    credit: {
        type: Number,
        contentType: String,
        default: 0
    },
    timestamp: {
        type: Date
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
    },
    workerUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'WorkerUser'
    }
});

module.exports = {
    model: mongoose.model('Activity', activity)
};