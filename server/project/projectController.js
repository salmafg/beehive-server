var Project = require('./projectModel');
var Error = require('../../config/error');
var async = require('async');
var fs = require('fs');
var mongoose = require('mongoose');
var unzip = require('unzip');

exports.getAll = function(req, res) {
    Project.find({}).populate('package').exec(function(err, projects) {
        if (err) return res.status(500).json({ error: Error.unknownError });
        else return res.status(200).json({ projects });
    });
};

exports.get = function(req, res) {
    Project.findById(req.params.id).populate('package').exec(function (err, project) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (project)
            return res.status(200).json({ project });
        else
            return res.status(404).json({ error: Error.notFound('Project') });
    });
};

exports.create = function(req, res) {
    if (!req.body.business_user || !req.body.name || !req.body.description || !req.body.label_names || !req.body.package)
        return res.status(400).json({ error: req.body.name });
    var project = new Project({
        name: req.body.name,
        business_user: req.user.id,
        description: req.body.description,
        label_names: req.body.label_names,
        package: req.body.package
    });
    project.save(function(err, project) {
        if (err) {
            if (err.name == 'ValidationError') {
                for (var field in err.errors)
                return res.status(400).json({ error: err.errors[field].message });
            }
            if (err.message)
                return res.status(500).json({ error: err.message });
            return res.status(500).json({ error: Error.unknownError });
        }
    });
};

exports.update = function(req, res) {
    Project.findById(req.params.id).exec(function (err, project) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (!project)
            return res.status(404).json({ error: Error.notFound('Project') });
        else {
            project.name = req.body.name ? req.body.name : project.name;
            project.description = req.body.description ? req.body.description : project.description;
            project.package = req.body.package ? req.body.package : project.package;
            project.label_names = req.body.label_names ? req.body.label_names : project.label_names;
            project.number_of_annotations = req.body.number_of_annotations ? req.body.number_of_annotations : project.number_of_annotations;
            project.used_storage = req.body.used_storage ? req.body.used_storage : project.used_storage;
            project.save(function (err, project) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        for (var field in err.errors)
                        return res.status(400).json({ error: err.errors[field].message });
                    }
                    if (err.message)
                        return res.status(500).json({ error: err.message });
                    return res.status(500).json({ error: Error.unknownError });
                }
                else
                    return res.status(200).json({project});
            });
        }
    });
};

exports.uploadDataSet = function (req, res) {
    Project.findById(req.params.id).exec(function (err, project) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (!project)
            return res.status(404).json({ error: Error.notFound('Project') });
        else {
            var read_path = req.body.images;
            var write_path = './images/' + project.business_user + '/' + project._id;
            async.waterfall([
                function (next) {
                    if (!fs.existsSync('./images')) {
                        fs.mkdir('./images/', function(){
                            fs.mkdir('./images/' + project.business_user, function(){
                                fs.mkdir(write_path, function(){
                                    next();
                                });
                            });
                        });
                    } else if (!fs.existsSync('./images/' + project.business_user)) {
                        fs.mkdir('./images/' + project.business_user, function() {
                            fs.mkdir(write_path, function(){
                                next();
                            });
                        });
                    } else if (!fs.existsSync(write_path)) {
                        fs.mkdir(write_path, function(){
                            next();
                        });
                    }
                    else next();
                }, function (next) {
                    fs.createReadStream(read_path)
                    .pipe(unzip.Extract({ path: write_path }));
                    next();
                }, function (next) {
                    fs.readdir(write_path, function (err, filenames) {
                        if (err) return res.status(500).send(err);
                        else {
                            filenames.forEach(function (filename) {
                                project.images.push({
                                    path: write_path + '/' + filename
                                });
                            });
                            next();
                        }
                    });
                }, function() {
                    project.save(function (err) {
                        if (err) return res.status(500).send(err);
                        else return res.sendStatus(200);
                    });
                }]);
        }
    });
};

exports.delete = function(req, res) {
    Project.findById(req.params.id).exec(function (err, project) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (!project)
            return res.status(404).json({ error: Error.notFound('Project') });
        else {
            project.remove(function(err) {
                if (err)
                    return res.status(500).json({ error: Error.unknownError });
                else
                    return res.status(200).json({ status: Error.deleteSuccess('Project') });
            });
        }
    });
}