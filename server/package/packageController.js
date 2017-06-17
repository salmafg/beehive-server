var Package = require('./packageModel').model;
var Error = require('../../config/error');

module.exports = {
    create: function(req, res) {
        if (!req.body.name || !req.body.max_storage) return res.status(400).json({ error: Error.invalidRequest });
        Package.create({ name: req.body.name, max_storage: req.body.max_storage },
         function(err, package) {
            if (err) return res.status(409).json({ error: Error.unknownError });
            else if (package) return res.status(201).json({ package });
            else return res.status(400).json({ error: Error.createFail('package') });
        });
    },
    get: function(req, res) {
        Package.findOne({ _id: req.params.id }, function(err, package) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (package) return res.status(200).json({ package });
            else return res.status(404).json({ error: Error.notFound('Package') });
        });
    },
    getAll: function(req, res) {
        Package.find(function(err, packages) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else return res.status(200).json({ packages });
        });
    },
    update: function(req, res) {
        Package.findById(req.params.id, function(err, package) {
            if (err) return res.status(409).json({ error: Error.alreadyExists('package') });
            else if (!package) return res.status(400).json({ error: Error.notFound('Package') });
            else {
                package.name = req.body.name ? req.body.name : package.name;
                package.max_storage = req.body.max_storage ? req.body.max_storage : package.max_storage;
                package.save(function (err, package) {
                    if (err) return res.status(500).json({ error: Error.updateFail('package') });
                    return res.status(200).json({ error: Error.updateSuccess('Package') });
                });
            }
        });
    },
    delete: function(req, res) {
        Package.findById(req.params.id).exec(function(err, package) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!package) return res.status(404).json({ error: Error.notFound('Package') });
            else {
                package.remove(function(err) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    else return res.status(200).json({ error: Error.deleteSuccess('Package') });
                });
            }
        });
    }
};