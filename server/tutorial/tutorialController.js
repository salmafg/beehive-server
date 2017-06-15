var Tutorial = require('./tutorialModel');
var Error = require('../../config/error');

exports.getAll = function(req, res) {
    Tutorial.find(function(err, tutorials) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else
            return res.status(200).json({ tutorials });
    });
};

exports.get = function(req, res) {
    Tutorial.findById(req.params.id).exec(function (err, tutorial) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (tutorial)
            return res.status(200).json({ tutorial });
        else
            return res.status(404).json({ error: Error.notFound('Tutorial') });
    });
};

exports.create = function(req, res) {
    if (!req.body.project || !req.body.images || !req.body.description)
        return res.status(400).json({ error: Error.invalidRequest });
   var tutorial = new Tutorial(req.body);
    tutorial.save(function(err, tutorial) {
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
    Tutorial.findById(req.params.id).exec(function (err, tutorial) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (!tutorial)
            return res.status(404).json({ error: Error.notFound('Tutorial') });
        else {
            // TODO: Should we update project as well?,
            tutorial.images = req.body.images ? req.body.images : tutorial.images;
            tutorial.description = req.body.description ? req.body.description : tutorial.description;
            tutorial.save(function (err, tutorial) {
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
                    return res.status(200).json({tutorial});
            });
        }
    });
};

exports.delete = function(req, res) {
    Tutorial.findById(req.params.id).exec(function (err, tutorial) {
        if (err)
            return res.status(500).json({ error: Error.unknownError });
        else if (!tutorial)
            return res.status(404).json({ error: Error.notFound('Tutorial') });
        else {
            tutorial.remove(function(err) {
                if (err)
                    return res.status(500).json({ error: Error.unknownError });
                else
                    return res.status(200).json({ status: Error.deleteSuccess('Tutorial') });
            });
        }
    });
}