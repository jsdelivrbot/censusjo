var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type: 'application/*+json'});

var establishmentDAO = require('../dao/orcl/establishmentDAO');

router.post('/GetEstablishments', jsonParser, function(req, res){
  try{
    var EstObj = req.body;
    var dao = new establishmentDAO();
    dao.GetEstablishments(EstObj, function(result){
      res.send(result);
    });
  }catch(ex){
    console.error(ex.message);
    res.send({error: ex});
  }
});

router.post('/GetServicesNoByLayer', jsonParser, function(req, res){
  try{
    var SearchObj = req.body;
    var dao = new establishmentDAO();
    dao.GetServicesNoByLayer(SearchObj, function(result){
      res.send(result);
    });
  }catch(ex){
    console.error(ex.message);
    res.send({error: ex});
  }
});

router.post('/GetServicesList', jsonParser, function(req, res){
  try{
    var dao = new establishmentDAO();
    dao.GetServicesList(function(result){
      res.send(result);
    });
  }catch(ex){
    console.log(ex);
    res.send({error: ex});
  }
});

module.exports = router;
