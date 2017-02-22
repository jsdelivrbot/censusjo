var baseDAO = require('../../dao/orcl/baseDAO');
var oracledb = require('oracledb');

var key = '$@sRN%^;YY!-+34?*';
var jwt = require('jsonwebtoken');

var userDAO = function () {
    this.getRoles = function (callback) {
        var dao = new baseDAO();
        dao.GetDataTable('usp_user_getRoles', function (result) {
            callback(result);
        });
    }

    this.AddUser = function (User, callback) {
        var dao = new baseDAO();
        dao.addParameters('username', User.username, 'string', oracledb.BIND_IN);
        dao.addParameters('password', User.password, 'string', oracledb.BIND_IN);
        dao.addParameters('roleId', User.roleId, 'number', oracledb.BIND_IN);
        dao.addParameters('key', key, 'string', oracledb.BIND_IN);
        dao.ExecuteProcedure('usp_user_addUser', true, 'number', 0, function (response) {
            callback(response);
        });
    }

    this.Login = function (User, callback) {
        var dao = new baseDAO();
        dao.addParameters('username', User.username, 'string', oracledb.BIND_IN);
        dao.addParameters('password', User.password, 'string', oracledb.BIND_IN);
        dao.addParameters('key', key, 'string', oracledb.BIND_IN);
        dao.GetDataTable('usp_user_login', function (result) {
            var expiryDate = new Date();
            expiryDate = expiryDate.setMinutes(expiryDate.getMinutes() + 30);
            var token = jwt.sign({username: User.username, password: User.password, exp: expiryDate}, 'U@$kldskf*(13', {

            });
            result.token = token;
            callback(result);
        });
    }
}

module.exports = userDAO;
