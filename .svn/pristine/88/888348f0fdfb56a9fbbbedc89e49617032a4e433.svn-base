var oracledb = require('oracledb');
var dbConfig = require('../../config/db');
var util = require('util');
var async = require('async');

var BaseDAO = function () {
    var bindvars = {
        params: {},
        paramNames: ''
    };

    var numRows = 10;
    var ColNames = [];
    var result = {
        list: [],
        val: '',
        error: ''
    };

    var GetConnectionVal = function () {
        return dbConfig.orclDB;
    };

    this.GenerateParamName = function (paramName) {
        return util.format('%s%s', ':', paramName);
    }

    var GetColumnNames = function (metaData) {
        async.map(metaData, function (item, callback) {
            ColNames.push(item.name);
        });
    }

    this.addParameters = function (_name, _value, _type, _direction) {
        switch (_type) {
            case 'number':
                _type = oracledb.NUMBER;
                break;
            case 'string':
                _type = oracledb.STRING;
                break;
            case 'boolean':
                _type = oracledb.BOOLEAN;
                break;
            default:
                _type = oracledb.STRING;
                break;
        }
        var param = {
            val: _value,
            type: _type,
            direction: _direction
        };
        this.SetParams(param, _name);
        //bindvars.params.push(param);
    };

    this.SetParams = function (paramObj, name) {
        if (bindvars.paramNames == '') {
            bindvars.paramNames = this.GenerateParamName(name);
        }
        else {
            bindvars.paramNames = util.format('%s%s%s', bindvars.paramNames, ',', this.GenerateParamName(name));
        }
        bindvars.params[name] = paramObj;
    };


    this.ExecuteProcedure = function (procName, hasOutput, outputType, defaultOutputValue, finalCallback) {
        oracledb.getConnection(
            GetConnectionVal(),
            function (err, connection) {
                if (err) {
                    console.error('error at get connection');
                    console.error(err.message);
                    return;
                }

                if (hasOutput) {
                    if (defaultOutputValue == 'number')
                        this.addParameters('retVal', oracledb.NUMBER, defaultOutputValue, oracledb.BIND_OUT);
                    else if (defaultOutputValue == 'string')
                        this.addParameters('retVal', oracledb.STRING, defaultOutputValue, oracledb.BIND_OUT);
                }
                var sqlQuery = util.format('%s%s%s%s%s', "Begin ", procName, "(", bindvars.paramNames, "); END;");
                connection.execute(sqlQuery, bindvars.params,
                    function (err, result) {
                        if (err) {
                            console.error('error at execute procedure');
                            console.error(err.message);
                            result.error = err.message;
                            doRelease(connection);
                            finalCallback(result);
                            return;
                        }
                        finalCallback(result.outBinds);
                    });
            }
        )
    }

    this.GetDataTable = function (procName, finalCallback) {

        bindvars.params.cursor = {
            type: oracledb.CURSOR, dir: oracledb.BIND_OUT
        };

        if (bindvars.paramNames == '') {
            bindvars.paramNames = this.GenerateParamName('cursor');
        } else {
            bindvars.paramNames = bindvars.paramNames.concat(',' + this.GenerateParamName('cursor'));
        }

        oracledb.getConnection(
            GetConnectionVal(),
            function (err, connection) {
                if (err) {
                    console.error('error at get connection');
                    console.error(err.message);
                    finalCallback({error: err.message});
                    return;
                }
                var sqlQuery = util.format('%s%s%s%s%s', "BEGIN ", procName, "(", bindvars.paramNames, "); END;");
                connection.execute(sqlQuery,
                    bindvars.params,
                    function (err, result) {
                        if (err) {
                            console.error('error at execute');
                            console.error(err.message);
                            doRelease(connection);
                            finalCallback({error: err.message});
                            return;
                        }

                        GetColumnNames(result.outBinds.cursor.metaData);
                        fetchRowsFromRS(connection, result.outBinds.cursor, numRows, finalCallback);
                    });
            });
    };

    function fetchRowsFromRS(connection, resultSet, numRows, callback) {
        resultSet.getRows( // get numRows rows
            numRows,
            function (err, rows) {
                if (err) {
                    console.log(err);
                    doClose(connection, resultSet); // always close the result set
                    callback({error: err.message});
                } else if (rows.length === 0) {    // no rows, or no more rows
                    doClose(connection, resultSet); // always close the result set
                    callback(result);
                } else if (rows.length > 0) {

                    async.map(rows, function (row) {
                        var counter = 0;
                        var rowObj = {};
                        async.map(row, function (col) {
                            rowObj[ColNames[counter]] = col;
                            counter++;
                        });
                        result.list.push(rowObj);
                    });
                    //resultArray = resultArray.concat(rows);
                    fetchRowsFromRS(connection, resultSet, numRows, callback);
                }
            });
    }

    function doRelease(connection) {
        connection.release(
            function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }

    function doClose(connection, resultSet) {
        resultSet.close(
            function (err) {
                if (err) {
                    console.error(err.message);
                }
                doRelease(connection);
            });
    }
}

module.exports = BaseDAO;
