var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tutorial = mongoose.Schema({
    project: {
        type: Schema.ObjectId,
        ref: 'BusinessUser',
    },
    images: {
        type: [Buffer]
    },
    description: {
        type: String
    },
});

module.exports = mongoose.model('Tutorial', Tutorial);
