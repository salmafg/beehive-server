const compression = require('compression');
const bodyParser = require('body-parser');
var cors = require('cors');
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

var config = require('./config');
var businessUserRoutes = require('./server/businessUser/businessUserRoutes');
var packageRoutes = require('./server/package/packageRoutes');
var projectRoutes = require('./server/project/projectRoutes');
var rankRoutes = require('./server/rank/rankRoutes');
var tutorialRoutes = require('./server/tutorial/tutorialRoutes');
var workerUserRoutes = require('./server/workerUser/workerUserRoutes');

mongoose.Promise = global.Promise;
var db = mongoose.connect(config.dbUrl, config.dbOpts);

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', rankRoutes);
app.use('/', workerUserRoutes);
app.use('/business', businessUserRoutes);
app.use('/project', projectRoutes);
app.use('/tutorial', tutorialRoutes);
app.use('/business', packageRoutes);

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
