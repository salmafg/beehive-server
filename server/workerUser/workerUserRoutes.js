var express = require('express');
var router = express.Router();
var WorkerUser = require('./workerUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/users', WorkerUser.getAll);

router.get('/users/:id', WorkerUser.get);

router.post('/users', WorkerUser.create);

router.post('/users/:id', WorkerUser.update);

router.post('/users/:id/password', WorkerUser.updatePassword);

router.delete('/users/:id', WorkerUser.delete);

router.post('/users/:id/activate', WorkerUser.activate);

router.post('/users/:id/deactivate', WorkerUser.deactivate);

module.exports = router;
