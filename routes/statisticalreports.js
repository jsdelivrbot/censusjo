var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type: 'application/*+json'});

var reportsDAO = require('../dao/orcl/statisticalreportsDAO');

router.post('/GetEstablishmentsCounts', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetEstablishmentsCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetBuildingsCounts', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetBuildingsCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetHousesCounts', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetHousesCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetFamilyCounts', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetFamilyCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetMemberCounts', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetMembersCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetJordaniansCount', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetJordaniansCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetNonJordaniansCounts', jsonParser, function (req, res) {
    var layerId = req.body.layerId;
    var isPercentage = req.body.isPercentage;
    try {
        var dao = new reportsDAO();
        dao.GetNonJordaniansCountsByLayerId(layerId, isPercentage, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

router.post('/GetLayerGeneralInfo', jsonParser, function (req, res) {
    var infoObj = req.body;
    try {
        var dao = new reportsDAO();
        dao.GetLayerGeneralInfo(infoObj, function (response) {
            res.send(response);
        });
    } catch (ex) {
        console.log(ex);
        res.send({error: ex});
    }
});

module.exports = router;
