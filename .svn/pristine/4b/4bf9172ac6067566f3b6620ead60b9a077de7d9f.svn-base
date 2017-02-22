var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type: 'application/*+json'});

var userDAO = require('../dao/orcl/userDAO');

router.post('/adduser', jsonParser, function(req, res){
  var User = req.body;
  var dao = new userDAO();
  dao.AddUser(User, function(response){
    res.send(response);
  });
});

router.post('/login', jsonParser, function(req, res){
  var User = req.body;
  var dao = new userDAO();
  dao.Login(User, function(response){
    res.send(response);
  });
});

module.exports = router;
