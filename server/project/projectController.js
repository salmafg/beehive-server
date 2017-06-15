var Project = require('./projectSchema');

exports.postProject = function(req, res) {
    var project = new Project(req.body);
    project.save(function(err, project) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).json(project)
    });
};

exports.getProject = function(req, res) {
    Project.findOne(
        { name: req.params.project_name},
        { business_username: req.params.business_username},
        function(err, project) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(project)
    });
}