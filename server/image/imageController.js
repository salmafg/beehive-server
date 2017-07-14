var Image = require('./imageModel').model;
var Error = require('../../config/error');

module.exports = {
    create: function(req, res) {
        if (!req.body.path) return res.status(400).json({ error: Error.invalidRequest });
        Image.create({ path: req.body.path },
          function (err, image) {
            if (err) return res.status(409).json({ error: Error.unknownError });
            else if (image) return res.status(201).json({ image });
            else return res.status(400).json({ error: Error.createFail('image') });
        });
    },
    get: function (req, res) {
      Image.findOne({ _id: req.params.id }, function (err, image) {
        if (err) return res.status(500).json({ error: Error.unknownError });
        else if (image) return res.status(200).json({ image });
        else return res.status(404).json({ error: Error.notFound('Image') });
      });
    },
    getAll: function (req, res) {
      Image.find(function (err, images) {
        if (err) return res.status(500).json({ error: Error.unknownError });
        else return res.status(200).json({ images });
      });
    },
    update: function (req, res) {
      Image.findById(req.params.id, function (err, image) {
        if (err) return res.status(409).json({ error: Error.alreadyExists('image') });
        else if (!image) return res.status(400).json({ error: Error.notFound('Image') });
        else {
          image.path = req.body.path ? req.body.path : image.path;
          image.save(function (err, image) {
            if (err) return res.status(500).json({ error: Error.updateFail('image') });
            return res.status(200).json({ error: Error.updateSuccess('Image') });
          });
        }
      });
    },
    delete: function (req, res) {
      Image.findById(req.params.id).exec(function (err, image) {
        if (err) return res.status(500).json({ error: Error.unknownError });
        else if (!image) return res.status(404).json({ error: Error.notFound('Image') });
        else {
          image.remove(function (err) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else return res.status(200).json({ error: Error.deleteSuccess('Image') });
          });
        }
      });
    }
};