var express = require('express');
var router = express.Router();
var Package = require('./packageController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/packages', Package.getAll);

router.get('/packages/:id', Package.get);

router.post('/packages', Package.create);

router.post('/packages/:id', Package.update);

router.delete('/packages/:id', Package.delete);

module.exports = router;
