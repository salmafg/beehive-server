const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const session  = require('express-session');
const fs = require('fs');

var config = require('./config');
var businessUserRoutes = require('./server/businessUser/businessUserRoutes');
var packageRoutes = require('./server/package/packageRoutes');
var projectRoutes = require('./server/project/projectRoutes');
var rankRoutes = require('./server/rank/rankRoutes');
var workerUserRoutes = require('./server/workerUser/workerUserRoutes');
var annotationRoutes = require('./server/annotation/annotationRoutes');

mongoose.Promise = global.Promise;
var db = mongoose.connect(config.dbUrl, config.dbOpts);

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors_options = {
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'POST', 'DELETE']
};
app.use(cors(cors_options));

var MongoStore = require('connect-mongo')(session);
var store = new MongoStore({
  mongooseConnection: db.connection
});

// Configuring sessions
app.use(session({
  secret: config.sessionSecret,
  cookie: { maxAge: config.cookieExpiry },
  store: store,
  resave: true,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/', rankRoutes);
app.use('/worker', workerUserRoutes);
app.use('/business', businessUserRoutes);
app.use('/', projectRoutes);
app.use('/business', packageRoutes);
app.use('/annotation', annotationRoutes);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server is listening on port %s', port);

module.exports = app;
