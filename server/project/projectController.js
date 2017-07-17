var Image = require('../image/imageModel');
var Project = require('./projectModel');
var Error = require('../../config/error');
var Helper = require('./projectHelper');
var mongoose = require('mongoose');
var projectPopulate = require('../../config').projectPopulate;

exports.getAll = function(req, res) {
    Project.find({}).populate('package images').exec(function(err, projects) {
        if (err) return res.status(500).json({ error: Error.unknownError });
        else return res.status(200).json({ projects });
    });
};

exports.get = function(req, res) {
    Project.findById(req.params.id).populate(projectPopulate)
    .exec(function (err, project) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (project)
            return res.status(200).json({ project });
        else
            return res.status(404).json({ error: Error.notFound('Project') });
    });
};

exports.create = function (req, res) {
    if (!req.body.name || !req.body.labelNames || !req.body.package ||
         (req.body.images.length > 0 && !req.body.images.includes('.zip')))
        return res.status(400).json({ error: Error.invalidRequest });
    Project.findOne({ businessUser: req.user.id, name: req.body.name }, function(err, dupl) {
        if (err) return res.status(500).json({ error: Error.unknownError });
        else if (dupl) return res.status(409).json({ error: 'Project with the same name already exists.'});
        else {
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
                if (err) return res.status(500).json({ error: err.message });
                else if (req.body.images.length > 0) {
                    Helper.uploadDataSet(req.body.images, project, function (err, project) {
                        if (err) return res.status(500).json({ error: err });
                        else {
                            project.populate(projectPopulate, function(err, project){
                                return res.status(200).send(project);
                            });
                        }
                    });
                }
                else {
                    project.populate(projectPopulate, function(err, project){
                        return res.status(200).send(project);
                    });
                }
            });
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
                else {
                    project.populate(projectPopulate, function(err, project){
                        return res.status(200).send(project);
                    });
                }
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

exports.dispatch = function(req, res) {
    Project.aggregate({ $sample: {size:1} }, function(err, data) {
        if (err) {
            return res.status(500).json({ error: Error.unknownError });
        } else {
            var project;
            if (data.length > 0) {
                project = data[0];
                Image.populate(project, { path: "images" }, function (err, project) {
                    return res.status(200).send(project);
                });
            } else {
                return res.status(404).json({ error: Error.notFound('Project') });
            }
        }
    });
};