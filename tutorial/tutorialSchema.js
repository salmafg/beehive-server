var mongoose = require('mongoose');

var Tutorial = mongoose.Schema({
    business_username: {
        type: String,
        required: true,
        unique: true
    },
    project_name: {
        type: String,
        required: true,
        unique: true
    },
    images: {
        type: Buffer[],
        required: true,
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Tutorial', Tutorial);
