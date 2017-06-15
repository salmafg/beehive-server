const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var config = require('./config');

var businessUserRouter = require('./server/businessUser/businessUserRoutes');
var projectRoutes = require('./server/project/projectRoutes');
var tutorialRoutes = require('./server/tutorial/tutorialRoutes');
var packageRouter = require('./server/package/packageRoutes');

mongoose.Promise = global.Promise;
var db = mongoose.connect(config.dbUrl, config.dbOpts);

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/business', businessUserRouter);
app.use('/project', projectRoutes);
app.use('/tutorial', tutorialRoutes);
app.use('/business', packageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server is listening on port %s', port);

module.exports = app;
