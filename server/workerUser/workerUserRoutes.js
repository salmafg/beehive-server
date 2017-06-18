var express = require('express');
var router = express.Router();
var WorkerUser = require('./workerUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.post('/login', WorkerUser.authenticate);

router.post('/signup', WorkerUser.create);

router.get('/profile/:id', WorkerUser.get);

router.put('/profile/:id', WorkerUser.isLoggedIn, WorkerUser.update);

router.put('/profile/:id/password', WorkerUser.isLoggedIn, WorkerUser.updatePassword);

router.get('/users', WorkerUser.getAll);

router.delete('/users/:id', WorkerUser.delete);

router.put('/users/:id/activate', WorkerUser.activate);

router.put('/users/:id/deactivate', WorkerUser.deactivate);

module.exports = router;
