var baseDAO = require('../../dao/orcl/baseDAO');
var oracledb = require('oracledb');

var establishmentDAO = function(){
  /*this.getEstablishments = function(callback){
    var dao = new baseDAO();
    dao.GetDataTable('USP_EST_GETESTABLISHMENT', function(result){
      callback(result);
    });
  }*/

  this.GetServicesList = function(callback){
    try{
      var dao = new baseDAO();
      dao.GetDataTable("usp_services_getServices", function(result){
        callback(result);
      });
    }catch(ex){
      console.log(ex);
      callback({error: ex});
    }
  }

  this.GetEstablishments = function(EstObj, callback){
    try{
      var dao = new baseDAO();
      dao.addParameters("GOVCODE", EstObj.govCode, "string", oracledb.BIND_IN);
      dao.addParameters("DISCODE", EstObj.distCode, "string", oracledb.BIND_IN);
      dao.addParameters("SUBDISTCODE", EstObj.subDistCode, "string", oracledb.BIND_IN);
      dao.addParameters("LOCCODE", EstObj.locCode, "string", oracledb.BIND_IN);
      dao.addParameters("AREACODE", EstObj.areaCode, "string", oracledb.BIND_IN);
      dao.addParameters("NHCODE", EstObj.nhCode, "string", oracledb.BIND_IN);
      dao.addParameters("ActicityCode", EstObj.activityCodes, "string", oracledb.BIND_IN);
      dao.addParameters("serviceNameSearch", EstObj.serviceNameSearch, "string", oracledb.BIND_IN);
      dao.addParameters("p_lang", EstObj.lang, "string", oracledb.BIND_IN);
      dao.GetDataTable("usp_est_getEstablishments", function(result){
        callback(result);
      });
    }catch(ex){
      console.log(ex);
      callback({error: ex});
    }
  }

  this.GetServicesNoByLayer = function(SearchObj, callback){
    try{
      var dao = new baseDAO();
      dao.addParameters("layerId", SearchObj.LayerId, "number", oracledb.BIND_IN);
      dao.addParameters("serviceId", SearchObj.ServiceId, "string", oracledb.BIND_IN);
      dao.addParameters("fromCount", SearchObj.fromNumber, "number", oracledb.BIND_IN);
      dao.addParameters("toCount", SearchObj.toNumber, "number", oracledb.BIND_IN);
      dao.addParameters("lang", SearchObj.lang, "string", oracledb.BIND_IN);
      dao.GetDataTable("usp_services_getNoServices", function(result){
        callback(result);
      });
    }catch(ex){
      console.log(ex);
      callback({error: ex});
    }
  }

}

module.exports = establishmentDAO;
