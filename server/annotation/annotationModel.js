var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var annotationSchema = new Schema({
    labels: {
        type: [Schema.ObjectId],
        ref: 'Label'
    }
});

module.exports = mongoose.model('Annotation', annotationSchema);