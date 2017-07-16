var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var BusinessUser = require('./businessUserModel').model;
var Project = require('../project/projectModel');
var Activity = require('../activity/activityModel').model;
var Error = require('../../config/error');

module.exports = {
    create: function (req, res) {
        if (!req.body.fullName || !req.body.email || !req.body.password || !req.body.phone || !req.body.organization)
            return res.status(400).json({ error: Error.invalidRequest });
        BusinessUser.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
            if (user)
                return res.status(409).json({ error: 'An account with this email already exists.' });
            else {
                BusinessUser.findOne({ phone: req.body.phone }, function (err, user) {
                    if (user) return res.status(409).json({ error: 'An account with this phone number already exists.' });
                    else {
                        var newBusinessUser = new BusinessUser({
                            fullName: req.body.fullName,
                            email: req.body.email.toLowerCase(),
                            password: req.body.password,
                            phone: req.body.phone,
                            organization: req.body.organization
                        });
                        newBusinessUser.save(function (err, user) {
                            if (err) {
                                if (err.name == 'ValidationError') {
                                    for (var field in err.errors)
                                        return res.status(400).json({ error: err.errors[field].message });
                                }
                                if (err.message) return res.status(500).json({ error: err.message });
                                return res.status(500).json({ error: Error.unknownError });
                            }
                            else return res.status(201).json({ user });
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
            passport.authenticate('business-local', function (err, user, info) {
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
            if (req.user instanceof BusinessUser) return next();
            else return res.status(403).json({ error: Error.unauthorized });
        } else return res.status(403).json({ error: Error.unauthorized });
    },
    activate: function (req, res) {
        BusinessUser.findByIdAndUpdate({ _id: req.params.id }, { isActivated: true }, function (err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) res.status(404).json({ error: Error.notFound('User') });
            else return res.sendStatus(200);
        });
    },
    deactivate: function (req, res) {
        BusinessUser.findByIdAndUpdate({ _id: req.params.id }, { isActivated: false }, function (err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) res.status(404).json({ error: Error.notFound('User') });
            else return res.sendStatus(200);
        });
    },
    update: function (req, res) {
        BusinessUser.findOne({ _id: req.user.id }, function (err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) res.status(404).json({ error: Error.notFound('User') });
            else {
                BusinessUser.findOne({ _id: { $ne: req.user._id }, email: req.body.email }, function (err, dupl) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    if (dupl) return res.status(409).json({ error: Error.alreadyExists('email') });
                    else {
                        user.fullName = req.body.fullName ? req.body.fullName : user.fullName;
                        user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
                        user.phone = req.body.phone ? req.body.phone : user.phone;
                        user.save(function (err, user) {
                            if (err) {
                                if (err.name == 'ValidationError') {
                                    for (var field in err.errors)
                                        return res.status(400).json({ error: err.errors[field].message });
                                }
                                if (err.message) return res.status(500).json({ error: err.message });
                                return res.status(500).json({ error: Error.updateFail('user') });
                            }
                            else return res.status(200).json({ user });
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
        BusinessUser.findById(req.params.id).exec(function (err, user) {
                if (err) return res.status(500).json({ error: Error.unknownError });
                else if (user) return res.status(200).json({ user });
                else return res.status(404).json({ error: Error.notFound('User') });
            });
    },
    getAll: function (req, res) {
        BusinessUser.find({}).exec(function (err, users) {
                if (err) return res.status(500).json({ error: Error.unknownError });
                else return res.status(200).json({ users });
            });
    },
    getAssociatedProjects: function (req, res) {
        Project.find({ businessUser: req.user.id }).populate('package')
        .exec(function(err, projects) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else return res.status(200).json({ projects });
        });
    },
    getAssociatedProject: function (req, res) {
        Project.findOne({ businessUser: req.user.id, _id: req.params.id }).populate('package')
        .exec(function(err, project) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!project) return res.status(404).json({ error: Error.notFound('Project') });
            else return res.status(200).json({ project });
        });
    },
    getProjectActivities: function (req, res) {
        Activity.find({ project: req.params.pid }).populate('workerUser')
        .exec(function(err, activities) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else return res.status(200).json({ activities });
        });
    },
    getProjectActivity: function (req, res) {
        Activity.findById(req.params.aid).populate('workerUser')
        .exec(function(err, activity) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!activity) return res.status(404).json({ error: Error.notFound('Activity') });
            else return res.status(200).json({ activity });
        });
    },
    delete: function (req, res) {
        BusinessUser.findById(req.params.id).exec(function(err, user) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!user) return res.status(404).json({ error: Error.notFound('User') });
            else {
                user.remove(function(err) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    else return res.status(200).json({ error: Error.deleteSuccess('User') });
                });
            }
        });
    }
};