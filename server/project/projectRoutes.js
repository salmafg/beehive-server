module.exports = projectRoutes;

function projectRoutes(passport) {
    var projectController = require('./projectController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/:project_name/:business_username')
        .get(projectController.getProject);

    router.route('/:project_name/:business_username/:description/:used_storage/:label_names/:number_of_annotations?')
        .post(projectController.postProject);

    return router;
}