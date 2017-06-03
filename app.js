const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');

var userRouter = require('./server/user/userRoutes');

mongoose.Promise = global.Promise;
//var db = mongoose.connect(config.dbUrl, config.dbOpts);

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Server is listening on port %s", port);

module.exports = app;
