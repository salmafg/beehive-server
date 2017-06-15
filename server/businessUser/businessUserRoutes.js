var express = require('express');
var router = express.Router();
var BusinessUser = require('./businessUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/users', BusinessUser.getAll);

router.get('/users/:id', BusinessUser.get);

router.post('/users', BusinessUser.create);

router.post('/users/:id', BusinessUser.update);

router.post('/users/:id/password', BusinessUser.updatePassword);

router.delete('/users/:id', BusinessUser.delete);

router.post('/users/:id/activate', BusinessUser.activate);

router.post('/users/:id/deactivate', BusinessUser.deactivate);

module.exports = router;
