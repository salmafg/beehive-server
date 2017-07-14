var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    path: {
        type: String
    }
});

module.exports = {
  model: mongoose.model('Image', Image)
};