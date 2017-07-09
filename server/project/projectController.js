var Project = require('./projectModel');
var Error = require('../../config/error');

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
            // TODO: Should we update business_user as well?,
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