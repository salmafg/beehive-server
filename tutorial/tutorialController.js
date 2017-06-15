var Tutorial = require('./tutorialSchema');

exports.postTutorial = function(req, res) {
    var tutorial = new Tutorial(req.body);
    tutorial.save(function(err, tutorial) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).json(tutorial)
    });
};

exports.getTutorial = function(req, res) {
    Tutorial.findOne(
        { project_name: req.params.project_name},
        { business_username: req.params.business_username},
        function(err, tutorial) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(tutorial)
    });
}