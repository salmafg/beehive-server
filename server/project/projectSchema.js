var mongoose = require('mongoose');

var Project = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    business_username: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    used_storage: {
        type: Number,
        required: true
    },
    label_names: {
        type: String[],
        required: true
    },
    number_of_annotations: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Project', Project);