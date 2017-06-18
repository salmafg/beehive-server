var LocalStrategy = require('passport-local').Strategy;
var BusinessUser = require('../server/businessUser/businessUserModel').model;
var WorkerUser = require('../server/workerUser/workerUserModel').model;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(id, done) {
        BusinessUser.findById(id).exec(function(err, user) {
            if (user) done(err, user);
        });
        WorkerUser.findById(id).exec(function(err, user) {
            if (user) done(err, user);
        });
    });
    passport.use('business-local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            BusinessUser.findOne({ email: email.toLowerCase() }, function(err, user) {
                if (err) return done(err);
                if (!user)
                    return done(null, false, { message: 'This email does not exist.' });
                else {
                    user.validatePassword(password, function(err, res) {
                        if (err) return done(null, false, { message: 'An error has occurred.' });
                        else if (!res) return done(null, false, { message: 'Oops! The password entered is incorrect.' });
                        else {
                            user.save(function() {
                                return done(null, user, { message: 'Welcome ' + user.full_name });
                            });
                        }
                    });
                }
            });
        }));
    passport.use('worker-local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            var query = (email.indexOf('@') === -1) ? { username: email.toLowerCase() } :
             { email: email.toLowerCase() };
            WorkerUser.findOne(query, function(err, user) {
                if (err) return done(err);
                if (!user)
                    return done(null, false, { message: 'This email does not exist.' });
                else {
                    if (!user.is_activated) done(null, false, { message: 'Sorry, your account has been deactivated.' });
                    else {
                        user.validatePassword(password, function(err, res) {
                            if (err) return done(null, false, { message: 'An error has occurred.' });
                            else if (!res) return done(null, false, { message: 'Oops! The password entered is incorrect.' });
                            else {
                                user.save(function() {
                                    return done(null, user, { message: 'Welcome ' + user.username });
                                });
                            }
                        });
                    }
                }
            });
        }));
};