var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    path: {
        type: String
    },
    annotations: {
        type: [Schema.ObjectId],
        ref: 'Annotation'
    }
});

module.exports = mongoose.model('Image', imageSchema);