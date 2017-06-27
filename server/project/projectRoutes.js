var express = require('express');
var router = express.Router();
var project = require('./projectController');
var businessUser = require('./../businessUser/businessUserController');

router.get('/', function(req, res) {
    res.send('Beehive');
});

router.get('/projects', businessUser.isLoggedIn, businessUser.getAssociatedProjects);
router.get('/projects/:id', businessUser.isLoggedIn, project.get);

router.post('/projects', businessUser.isLoggedIn, project.create);
router.put('/projects/:id', businessUser.isLoggedIn, project.update);

router.delete('/projects/:id', businessUser.isLoggedIn, project.delete);

module.exports = router;