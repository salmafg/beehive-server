var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 10;

var workerUserSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    rank: {
        type: Schema.ObjectId,
        ref: 'Rank'
    },
    credit: {
        type: Number,
        required: true,
        default: 0
    },
    is_reviewer: {
        type: Boolean,
        required: true,
        default: false
    },
    total_annotations_count: {
        type: Number,
        required: true,
        default: 0
    },
    current_payable_credit: {
        type: Number,
        required: true,
        default: 0
    },
    is_activated: {
        type: Boolean,
        required: true,
        default: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// email validation
workerUserSchema.path('email').validate(function(email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/;
    return emailRegex.test(email);
}, 'The email entered is invalid.');

// username length validation
workerUserSchema.path('username').validate(function(username) {
    var usernameRegex = /^\S{3,15}$/;
    return usernameRegex.test(username);
}, 'The username must be between 3 and 15 characters long.');

// username character validation
workerUserSchema.path('username').validate(function(username) {
    var usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
    return usernameRegex.test(username);
}, 'The username may only contain letters, numbers, \'.\' and \'_\'');

// password validation
workerUserSchema.path('password').validate(function(password) {
    if (!this.isModified('password')) return true;
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}, 'Password must be at least 8 characters and contain at least one letter and one number.');

// password encryption
workerUserSchema.pre('save', function(next) {
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

workerUserSchema.methods.validatePassword = function(password, next) {
    bcrypt.compare(password, this.password, function(err, res) {
        if (err) return next(err);
        next(null, res);
    });
};

module.exports = {
    model: mongoose.model('WorkerUser', workerUserSchema)
};
