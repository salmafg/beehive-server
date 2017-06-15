module.exports = tutorialRoutes;

function tutorialRoutes(passport) {
    var tutorialController = require('./tutorialController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/:project_name/:business_username')
        .get(tutorialController.getTutorial);

    router.route('/:project_name/:business_username/:description/:used_storage/:label_names/:number_of_annotations?')
        .post(tutorialController.postTutorial);

    return router;
}