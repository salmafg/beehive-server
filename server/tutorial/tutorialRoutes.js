var express = require('express');
var router = express.Router();
var modelController = require('./tutorialController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/tutorials', modelController.getAll);
router.get('/tutorials/:id', modelController.get);

router.post('/tutorials', modelController.create);
router.post('/tutorials/:id', modelController.update);

router.delete('/tutorials/:id', modelController.delete);

module.exports = router;