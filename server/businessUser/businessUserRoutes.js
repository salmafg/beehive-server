var express = require('express');
var router = express.Router();
var businessUser = require('./businessUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/users', businessUser.getAll);

router.get('/users/:id', businessUser.get);

router.post('/users', businessUser.create);

router.post('/users/:id', businessUser.update);

router.post('/users/:id/password', businessUser.updatePassword);

router.delete('/users/:id', businessUser.delete);

router.post('/users/:id/activate', businessUser.activate);

router.post('/users/:id/deactivate', businessUser.deactivate);

module.exports = router;
