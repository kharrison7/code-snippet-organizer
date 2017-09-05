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

// const dataeasy = require("./data_easy");
// const easywords = dataeasy.words;
// const datamedium = require("./data_medium");
// const mediumwords = datamedium.words;
const logic = require('./logic');
const routes = require('./routes');

// middleware
router.use(function(req,res,next){
// console.log("Middleware");
next();
});

router.get('/',function(req,res){
  console.log("index for user");
  res.render('index');
});

router.post('/',function(req,res){
  res.redirect('/');
});

module.exports = router;
