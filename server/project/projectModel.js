var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    path: {
        type: String
    }
});

var Project = mongoose.Schema({
    business_user: {
        type: Schema.ObjectId,
        ref: 'BusinessUser'
    },
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    used_storage: {
        type: Number
    },
    label_names: {
        type: [String]
    },
    package: {
        type: Schema.ObjectId,
        ref: 'Package'
    },
    number_of_annotations: {
        type: Number
    },
    tutorial: {
        data: Buffer,
        content_type: String
    },
    images: {
        type: [imageSchema]
    }
});

module.exports = mongoose.model('Project', Project);