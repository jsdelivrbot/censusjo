var oracledb = require('oracledb');
var baseDAO = require('./../../dao/orcl/baseDAO');

var statisticalreportsDAO = function () {
    this.GetEstablishmentsCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_estcount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetBuildingsCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_buildingcount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetHousesCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_housingcount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetFamilyCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_familycount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetMembersCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_membercount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetJordaniansCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_jocount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetNonJordaniansCountsByLayerId = function (layerId, isPercentage, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters('layerId', layerId, 'number', oracledb.BIND_IN);
            dao.addParameters('isPercentage', isPercentage, 'number', oracledb.BIND_IN);
            dao.GetDataTable('usp_reports_nonjocount', function (response) {
                callback(response);
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    this.GetLayerGeneralInfo = function (infoObj, callback) {
        try {
            var dao = new baseDAO();
            dao.addParameters("layerId", infoObj.layerId, "number", oracledb.BIND_IN);
            dao.addParameters("code", infoObj.code, "string", oracledb.BIND_IN);
            dao.GetDataTable("usp_layers_getgeneralinfo", function (result) {
                callback(result);
            });
        } catch (ex) {
            console.log(ex);
            callback({error: ex});
        }
    };

}

module.exports = statisticalreportsDAO;
