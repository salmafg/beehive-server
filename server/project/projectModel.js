var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = mongoose.Schema({
    business_user: {
        type: Schema.ObjectId,
        ref: 'BusinessUser',
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    used_storage: {
        type: Number,
    },
    label_names: {
        type: [String],
    },
    number_of_annotations: {
        type: Number,
    }
});

module.exports = mongoose.model('Project', Project);