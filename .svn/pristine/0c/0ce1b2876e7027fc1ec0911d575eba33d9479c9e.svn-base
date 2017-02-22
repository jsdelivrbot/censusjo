/**
 * Created by mmajali on 10/25/16.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type: 'application/*+json'});

var IndicatorsDAO = require('../dao/orcl/indicatorsDAO');

router.post('/getChapters', jsonParser, function (req, res) {
    try {
        var dao = new IndicatorsDAO();
        dao.getIndicatorsChapters(function (result) {
            res.send(result);
        });
    } catch (ex) {
        console.log(ex.message);
        res.send({error: ex});
    }
});

router.post('/getIndictList', jsonParser, function (req, res) {
    try {
        var dao = new IndicatorsDAO();
        dao.getIndicatorsList(req.body.chapterNo, function(result){
           res.send(result);
        });
    } catch (ex) {
        console.log(ex.message);
        res.send({error: ex});
    }
});

router.post('/getResults', jsonParser, function(req, res){
   try{
       var dao = new IndicatorsDAO();
       dao.getIndicatorResult(req.body, function(result){
          res.send(result);
       });
   } catch(ex){
       console.log(ex.message);
       res.send({error: ex});
   }
});

module.exports = router;
