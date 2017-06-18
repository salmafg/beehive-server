var express = require('express');
var router = express.Router();
var BusinessUser = require('./businessUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.post('/login', BusinessUser.authenticate);

router.post('/signup', BusinessUser.create);

router.get('/profile/:id', BusinessUser.get);

router.put('/profile/:id', BusinessUser.isLoggedIn, BusinessUser.update);

router.put('/profile/:id/password', BusinessUser.isLoggedIn, BusinessUser.updatePassword);

router.get('/users', BusinessUser.getAll);

router.delete('/users/:id', BusinessUser.delete);

router.put('/users/:id/activate', BusinessUser.activate);

router.put('/users/:id/deactivate', BusinessUser.deactivate);

module.exports = router;
