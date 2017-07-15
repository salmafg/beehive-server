var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var annotationSchema = new Schema({
    labels: {
        type: String
    }
});

module.exports = mongoose.model('Annotation', annotationSchema);