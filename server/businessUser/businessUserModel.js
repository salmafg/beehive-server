var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 10;

var businessUserSchema = new Schema({
    full_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    organization: {
        type: String
    },
    message: {
        type: String
    },
    is_activated: {
        type: Boolean,
        required: true,
        default: false
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// email validation
businessUserSchema.path('email').validate(function(email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/;
    return emailRegex.test(email);
}, 'The email entered is invalid.');

// password validation
businessUserSchema.path('password').validate(function(password) {
    if (!this.isModified('password')) return true;
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}, 'Password must be at least 8 characters and contain at least one letter and one number.');

// password encryption
businessUserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

businessUserSchema.methods.validatePassword = function(password, next) {
    bcrypt.compare(password, this.password, function(err, res) {
        if (err) return next(err);
        next(null, res);
    });
};

module.exports = {
    model: mongoose.model('BusinessUser', businessUserSchema)
};