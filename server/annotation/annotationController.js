var Annotation = require('./annotationModel');
var Image = require('../image/imageModel');
var WorkerUser = require('../workerUser/workerUserModel').model;
var LabelHelper = require('../label/labelHelper');

exports.create = function(req, res) {
    if (!req.body.workerId || !req.body.imageId || !req.body.annotation || !req.body.annotation.labels) {
        return res.status(400).json({ error: Error.invalidRequest });
    } else {
        var newAnnotation = new Annotation({});
        var labels = req.body.annotation.labels
        labels.forEach(function(label) {
            LabelHelper.create(label, function(err, labelObject) {
                if (err) {
                    return res.status(500).json({ error: Error.unknownError });
                } else {
                    newAnnotation.labels.push(labelObject._id)
                }
            })
        })

        newAnnotation.save(function(err, newAnnotationObject) {
            if (err) {
                return res.status(500).json({ error: Error.unknownError });
            } else {
                WorkerUser.findById(req.body.workerId).exec(function (err, workerUser) {
                    if (err) {
                        return res.status(500).json({ error: Error.unknownError });
                    } else if (!workerUser) {
                        return res.status(404).json({ error: Error.notFound('WorkerUser') });
                    } else {
                        workerUser.annotations.push(newAnnotationObject);
                        workerUser.save(function(err, updatedWorkerUser) {
                            if (err) {
                                return res.status(500).json({ error: Error.unknownError });
                            } else {
                                Image.findById(req.body.imageId).exec(function (err, image) {
                                    if (err) {
                                        return res.status(500).json({ error: Error.unknownError });
                                    } else if (!image) {
                                        return res.status(404).json({ error: Error.notFound('Image') });
                                    } else {
                                        image.annotations.push(newAnnotationObject);
                                        image.save(function(err, updatedImage) {
                                            if (err) {
                                                return res.status(500).json({ error: Error.unknownError });
                                            } else {
                                                return res.status(200).send(newAnnotationObject);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}
