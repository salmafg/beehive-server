var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packageSchema = new Schema({
    name: {
        type: String
    },
    maxStorage: {
        type: String
    }
});

module.exports = {
    model: mongoose.model('Package', packageSchema)
};