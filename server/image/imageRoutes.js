var express = require('express');
var router = express.Router();
var ImageController = require('./imageController');

router.get('/images', ImageController.getAll);
router.get('/images/:id', ImageController.get);

router.post('/images', ImageController.create);
router.put('/images/:id', ImageController.update);
router.delete('/images/:id', ImageController.delete);

module.exports = router;
