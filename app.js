//app.js code here.
// runs at http://localhost:3000/
// This requires all the modules and files.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const expressValidator = require('express-validator');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
//FLASH MESSAGES ALLOWS YOU TO USE res.locals.getMessages(), AND STORE THEM IN messages
const flash = require('express-flash-messages');
const List = require('./models/user');
const bcrypt = require('bcryptjs');
const models = require("./models/user")
const User = models.User;

// const User = models.User;
const LocalStrategy = require('passport-local').Strategy;
const mongoURL = 'mongodb://localhost:27017/test';
mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
// const validation = require('./test/validation/checkVal.js');

const routes = require('./routes.js');
// Creates and includes a file system (fs) module
const fs = require('fs');
// Create authorization session
let authorizedSession = "";
// Create app
const app = express();
// Set app to use bodyParser() middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.text());
//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects
//'expressValidator' must come after 'bodyParser', since data must be parsed first!
app.use(expressValidator());

// This consolelogs a buch of actions
// app.use(logger('dev'));
app.use(cookieParser());
// Sets the view engine and router.
app.engine('mustache', mustacheExpress());
// use views folder to pick up views.
app.set('views', ['./views', './views/admin']);
// sets mustache as the view engine.
app.set('view engine', 'mustache');
// use the correct routes when callled.

// fetch static content from public folder, example css.
app.use(express.static(__dirname + '/public'));

// This uses flash messages.
app.use(flash());


// This sets up the session.
app.use(session({
  secret: 'variant',
  // only save if user changes something.
  resave: false,
  // set to determine save to sessions.
  saveUninitialized: true,
  cookie: {maxAge: 1000000, httpOnly: false}
}));

const getUserInfo = function(req, res, next) {
    User.findOne({_id: req.params.id}, req.body).then(function(users) {
        req.users = users;
        console.log(req.users);
        next();
    })
};


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.authenticate(username, password, function(err, user) {
          //HERE, USER is the entire user object
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                })
            }
        })
    }
));
passport.serializeUser(function(userobj, done) {
  //HERE, USER is the entire user object
    done(null, userobj.id);//Returns the randomized ID, sends to deserializeUser
});
passport.deserializeUser(function(id, done) {
  //Gets the ID from the serializeUser
    User.findById(id, function(err, userobj) {
      //finds that user object by its ID
        done(err, userobj);//FIND OUT WHERE THIS RETURNS TO
    });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})







app.use(routes);

// This ties the file to the proper localhost or host.
app.listen(process.env.PORT || 3000, function() {
  console.log('Successfully started express application!');
});

// In case I want to export something later.
module.exports = app;
