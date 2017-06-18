var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rankSchema = new Schema({
    title: {
        type: String
    },
    icon: {
        data: Buffer,
        content_type: String
    },
    max_points: {
        type: Number
    }
});

module.exports = {
    model: mongoose.model('Rank', rankSchema)
};