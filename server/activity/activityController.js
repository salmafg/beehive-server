var Activity = require('./activityModel').model;
var Error = require('../../config/error');

module.exports = {
    create: function(req, res) {
        if (!req.body.project || !req.body.workerUser) return res.status(400).json({ error: Error.invalidRequest });
        Activity.create({ project: req.body.project, workerUser: req.body.WorkerUser },
         function(err, activity) {
            if (err) return res.status(409).json({ error: Error.unknownError });
            else if (activity) return res.status(201).json({ activity });
            else return res.status(400).json({ error: Error.createFail('activity') });
        });
    },
    get: function(req, res) {
        Activity.findOne({ _id: req.params.id }, function(err, activity) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (activity) return res.status(200).json({ activity });
            else return res.status(404).json({ error: Error.notFound('Activity') });
        });
    },
    getAll: function(req, res) {
        Activity.find(function(err, activites) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else return res.status(200).json({ activites });
        });
    },
    update: function(req, res) {
        Activity.findById(req.params.id, function(err, activity) {
            if (err) return res.status(409).json({ error: Error.alreadyExists('activity') });
            else if (!activity) return res.status(400).json({ error: Error.notFound('Activity') });
            else {
                activity.annotatedImageCount = req.body.annotatedImageCount ? req.body.annotatedImageCount : activity.annotatedImageCount;
                activity.credit = req.body.credit ? req.body.credit : activity.credit;
                activity.timestamp = Date.now;
                activity.save(function (err, activity) {
                    if (err) return res.status(500).json({ error: Error.updateFail('activity') });
                    return res.status(200).json({ error: Error.updateSuccess('Activity') });
                });
            }
        });
    },
    delete: function(req, res) {
        Activity.findById(req.params.id).exec(function(err, activity) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!activity) return res.status(404).json({ error: Error.notFound('Activity') });
            else {
                activity.remove(function(err) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    else return res.status(200).json({ error: Error.deleteSuccess('Activity') });
                });
            }
        });
    }
};