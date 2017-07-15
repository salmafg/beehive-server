var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var labelSchema = new Schema({
    name: {
        type: String
    },
    x: {
        type: Number
    },
    y: {
        type: Number
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    }
});

module.exports = mongoose.model('Label', labelSchema);