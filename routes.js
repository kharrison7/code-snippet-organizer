// This runs the routing.
const session = require('express-session');
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const router = express.Router();
const app = express();
const fs = require("fs");
const expressValidator = require('express-validator');
const logic = require('./logic');
const routes = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash-messages');
const bcrypt = require('bcryptjs');

// This pulls from the models.
const models = require("./models/user");
const User = models.User;
const modelsSnip = require("./models/snippet");
const snippet = modelsSnip.snippet;

// let User = require('./models/user');

// const User = require('./models/user');

// const User = models.User;
const LocalStrategy = require('passport-local').Strategy;
const mongoURL = 'mongodb://localhost:27017/test';
mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
// const validation = require('./test/validation/checkVal.js');




// middleware
router.use(function(req,res,next){
// console.log("Middleware");
next();
});

// These are the login checks
const loginRedirect = function (req, res, next) {
  if (req.user) {
    res.redirect('/');
    return
  } else {
    next();
  }
}
const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login/');
  }
}
const checkLogin = function (req, res, next) {
  if (req.sessionID === req.user.sessionID) {
    next()
  } else {
    res.redirect('/login/');
  }
}

// These are the passport checks
// For Login: gets username, matches username and validates pw.
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//   User.getUserByUserName(username, function(err, user){
//     if(err) throw err;
//     if(!user){
//       return done(null, false, {message: 'Unknown User'});
//     }
//     User.comparePassword(password, user.password, function(err, isMatch){
//       if(err) throw err;
//       if(isMatch){
//         return done(null, User);
//       }
//       else{
//         return done(null, false, {message: 'Invalid password'});
//       }
//     });
//   });
// }));

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


// GETS and POSTS:
router.get('/',function(req,res){
  console.log("index for user");
  res.render('index');
});

router.post('/',function(req,res){
  res.redirect('/');
});

router.get('/login',function(req,res){
  console.log("login for user");
  res.render('login');
});

router.post('/login',function(req,res){
  res.redirect('/login');
});

router.get('/register',function(req,res){
  console.log("register for user");
  res.render('register');
});

router.post('/register',function(req,res){
  res.redirect('/register');
});

router.get('/about',function(req,res){
  console.log("about for user");
  User.find().then(function (user){
    res.render('about', {user: user});
  });
});

router.post('/about',function(req,res){
  res.redirect('/about');
});

// This runs when the user registers.
router.post('/submit_registration/',function(req,res){
  console.log("submit_registration");
  // Validation:
    req.checkBody('username', 'Username must be alphanumeric').isAlphanumeric();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Type Password Again').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Passwords do not match').equals(req.body.password2);
  console.log(req.body);
  // Adds user to database.
  User.create(req.body).then(function (user){
    // req.flash("success_msg", "You are registered");
    res.redirect('/login');
  });
});



router.post('/login_submit',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        req.session.email = req.body.email;
        console.log("new session info added");
        console.log("Session username: "+ req.session.username);
    res.redirect('/');
  });

router.get('/logout/', function(req, res) {
  console.log("logout page");
  User.find().then(function (user){
    res.render('logout', {user: user});
  });
});

router.post('/logout_submit', function(req, res) {
  console.log("Loged Out");
  req.logout();
  req.session.destroy();
  res.redirect('/');
});





router.get('/signup/', loginRedirect,  function(req, res) {
  res.render('signup');
});



module.exports = router;
