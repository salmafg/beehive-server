var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rankSchema = new Schema({
    title: {
        type: String
    },

    index: {
        type: Number
    },

    maxPoints: {
        type: Number
    },
    
    icon: {
        data: Buffer,
        contentType: String
    }

});

module.exports = {
    model: mongoose.model('Rank', rankSchema)
};