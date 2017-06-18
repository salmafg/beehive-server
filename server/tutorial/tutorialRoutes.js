var express = require('express');
var router = express.Router();
var tutorial = require('./tutorialController');
var businessUser = require('./../businessUser/businessUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/tutorials', businessUser.isLoggedIn, tutorial.getAll);
router.get('/tutorials/:id', businessUser.isLoggedIn, tutorial.get);

router.post('/tutorials', businessUser.isLoggedIn, tutorial.create);
router.put('/tutorials/:id', businessUser.isLoggedIn, tutorial.update);

router.delete('/tutorials/:id', businessUser.isLoggedIn, tutorial.delete);

module.exports = router;