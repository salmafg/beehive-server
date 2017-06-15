var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packageSchema = new Schema({
    name: {
        type: String
    },
    max_storage: {
        type: String
    }
});

module.exports = {
    model: mongoose.model('Package', packageSchema)
};