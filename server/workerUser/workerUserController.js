var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var WorkerUser = require('./workerUserModel').model;
var Error = require('../../config/error');
var Rank = require('../rank/rankModel');

module.exports = {
    create: function (req, res) {
        if (!req.body.username || !req.body.email || !req.body.password)
            return res.status(400).json({ error: Error.invalidRequest });
        WorkerUser.findOne({ username: req.body.username.toLowerCase() }, function (err, user) {
            if (user)
                return res.status(409).json({ error: 'Username is already taken.' });
            else {
                WorkerUser.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
                    if (user) return res.status(409).json({ error: 'An account with this email already exists.' });
                    else {
                        var newWorkerUser = new WorkerUser({
                            username: req.body.username.toLowerCase(),
                            email: req.body.email.toLowerCase(),
                            password: req.body.password
                        });
                        newWorkerUser.save(function (err, workerUser) {
                            if (err) {
                                if (err.name == 'ValidationError') {
                                    for (var field in err.errors)
                                        return res.status(400).json({ error: err.errors[field].message });
                                }
                                if (err.message) return res.status(500).json({ error: err.message });
                                return res.status(500).json({ error: Error.unknownError });
                            }
                            else return res.status(201).json({ workerUser });
                        });
                    }
                });
            }
        });
    },
    authenticate: function (req, res, next) {
        if (!req.body.email) return res.status(400).json({ error: Error.missingParameter('email') });
        if (!req.body.password) return res.status(400).json({ error: Error.missingParameter('password') });
        else {
            passport.authenticate('worker-local', function (err, user, info) {
                if (err) return res.status(500).send({ error: Error.unknownError });
                if (!user) return res.status(400).json({ error: info.message });
                req.logIn(user, function (err) {
                    if (err) return next(err);
                    return res.status(200).json({ user });
                });
            })(req, res, next);
        }
    },
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user instanceof WorkerUser) return next();
            else return res.status(403).json({ error: Error.unauthorized });
        } else return res.status(403).json({ error: Error.unauthorized });
    },
    activate: function (req, res) {
        WorkerUser.findByIdAndUpdate({ _id: req.params.id }, { isActivated: true }, function (err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) res.status(404).json({ error: Error.notFound('User') });
            else return res.sendStatus(200);
        });
    },
    deactivate: function (req, res) {
        WorkerUser.findByIdAndUpdate({ _id: req.params.id }, { isActivated: false }, function (err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) res.status(404).json({ error: Error.notFound('User') });
            else return res.sendStatus(200);
        });
    },
    update: function (req, res) {
        WorkerUser.findOne({ _id: req.user.id }, function (err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) res.status(404).json({ error: Error.notFound('User') });
            else {
                WorkerUser.findOne({ _id: { $ne: user._id }, email: req.body.email }, function (err, dupl) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    if (dupl) return res.status(409).json({ error: Error.alreadyExists('email') });
                    else {
                        WorkerUser.findOne({ _id: { $ne: user._id }, username: req.body.username }, function (err, dupl) {
                            if (err) return res.status(500).json({ error: Error.unknownError });
                            if (dupl) return res.status(409).json({ error: Error.alreadyExists('username') });
                            else {
                                user.username = req.body.username ? req.body.username.toLowerCase() : user.username;
                                user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
                                user.save(function (err, workerUser) {
                                    if (err) {
                                        if (err.name == 'ValidationError') {
                                            for (var field in err.errors)
                                                return res.status(400).json({ error: err.errors[field].message });
                                        }
                                        if (err.message) return res.status(500).json({ error: err.message });
                                        return res.status(500).json({ error: Error.updateFail('user') });
                                    }
                                    else return res.status(200).json({ workerUser });
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    updatePassword: function (req, res) {
        if (!req.body.oldPassword) return res.status(400).json({ error: Error.missingParameter('oldPassword') });
        if (!req.body.newPassword) return res.status(400).json({ error: Error.missingParameter('newPassword') });
        if (!req.body.confirmPassword) return res.status(400).json({ error: Error.missingParameter('confirmPassword') });
        else if (req.body.newPassword !== req.body.confirmPassword)
            return res.status(400).json({ error: Error.confirmPassword });
        else {
            bcrypt.compare(req.body.oldPassword, req.user.password, function(err, match) {
                if (err) return res.status(500).json({ error: Error.unknownError });
                else if (!match) return res.status(400).json({ error: 'Password is incorrect.' });
                else {
                    req.user.password = req.body.newPassword;
                    req.user.save(function (err) {
                        if (err && err.errors && err.errors.password.message)
                            return res.status(400).json({ error: err.errors.password.message });
                        else if (err) return res.status(500).json({ error: Error.unknownError });
                        else return res.status(200).json({ error: Error.updateSuccess('Password') });
                    });
                }
            });
        }
    },
    get: function (req, res) {
        WorkerUser.findById(req.params.id).exec(function (err, user) {
                if (err) return res.status(500).json({ error: Error.unknownError });
                else if (user) return res.status(200).json({ user });
                else return res.status(404).json({ error: Error.notFound('User') });
            });
    },
    getAll: function (req, res) {
        WorkerUser.find({}).exec(function (err, workerUsers) {
                if (err) return res.status(500).json({ error: Error.unknownError });
                else return res.status(200).json({ workerUsers });
            });
    },
    delete: function (req, res) {
        WorkerUser.findById(req.params.id).exec(function(err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) return res.status(404).json({ error: Error.notFound('User') });
            else {
                user.remove(function(err) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    else return res.status(200).json({ error: Error.deleteSuccess('User') });
                });
            }
        });
    },
    
    updateRank: function(req, res){
           WorkerUser.findByIdAndUpdate({ _id: req.params.id }, function (err, user) {
                if (err) return res.status(500).json({ error: Error.unknownError });
                else if (!user) res.status(404).json({ error: Error.notFound('User') });
                else{
                    if (user.totalpoints >= user.rank.maxpoints){
                        Rank.findOne({ index: (user.rank.index + 1)}, function (err, rank) {
                            if (err) return res.status(500).json({ error: Error.unknownError });
                            else user.rank = rank});
                    }

                }
        });
    }
};