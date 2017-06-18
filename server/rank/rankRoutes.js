var express = require('express');
var router = express.Router();
var Rank = require('./rankController');

router.get('/ranks', Rank.getAll);

router.get('/ranks/:id', Rank.get);

router.post('/ranks', Rank.create);

router.post('/ranks/:id', Rank.update);

router.delete('/ranks/:id', Rank.delete);

module.exports = router;
