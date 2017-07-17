var express = require('express');
var router = express.Router();
var WorkerUserController = require('../workerUser/workerUserController');
var AnnotationController = require('./annotationController')

router.post('/', WorkerUserController.isLoggedIn, AnnotationController.create)

module.exports = router;
