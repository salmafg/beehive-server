var express = require('express');
var router = express.Router();
var modelController = require('./projectController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/projects', modelController.getAll);
router.get('/projects/:id', modelController.get);

router.post('/projects', modelController.create);
router.post('/projects/:id', modelController.update);

router.delete('/projects/:id', modelController.delete);

module.exports = router;
