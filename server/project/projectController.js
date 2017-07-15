var Project = require('./projectModel');
var Error = require('../../config/error');
var Helper = require('./projectHelper');
var mongoose = require('mongoose');

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

exports.create = function (req, res) {
    if (!req.body.name || !req.body.description || !req.body.labelNames || !req.body.package)
        return res.status(400).json({ error: Error.invalidRequest });
    var project = new Project({
        name: req.body.name,
        businessUser: req.user.id,
        description: req.body.description,
        labelNames: req.body.labelNames,
        package: req.body.package
    });
    if (req.body.numberOfAnnotations) project.numberOfAnnotations = req.body.numberOfAnnotations;
    if (req.body.tutorial) project.tutorial = req.body.tutorial;
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
        else if (req.body.images) {
            if (!req.body.images.includes('.zip'))
                return res.status(400).send({ error: Error.invalidRequest});
            else {
                console.log("before projectController Helper.uploadDataSet")
                Helper.uploadDataSet(req.body.images, project, function (err) {
                    if (err) return res.status(500).json({ error: err });
                    else return res.status(200).send(project);
                });
            }
        }
        else return res.status(200).send(project);
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
            project.labelNames = req.body.labelNames ? req.body.labelNames : project.labelNames;
            project.numberOfAnnotations = req.body.numberOfAnnotations ? req.body.numberOfAnnotations : project.numberOfAnnotations;
            project.usedStorage = req.body.usedStorage ? req.body.usedStorage : project.usedStorage;
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
};