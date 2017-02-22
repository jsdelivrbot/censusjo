/**
 * Created by muhammad on 8/4/16.
 */
'use strict';

angular.module('gisapp')
    .factory('serviceData', ['$rootScope', '$q', 'serviceBase', function ($rootScope, $q, serviceBase) {
        var service = {};

        service.loadColorBrewer = function (callback) {
            serviceBase.HttpRequest.Get({url: '/colorBrewer.json', data: {}}, function (response) {
                callback(response);
            });
        };

        service.loadLayers = function (callback) {
            serviceBase.HttpRequest.Get({url: '/layers/layers.json', data: {}}, function (response) {
                callback(response);
            });
        };

        service.getServicesList = function (callback) {
            serviceBase.HttpRequest.Save({
                url: '/establishments/GetServicesList',
                data: {}
            }, function (response) {
                $rootScope.$broadcast('serviceListChanged', response.list);
                //$rootScope.ServicesList = response.list;
                callback();
            });
        };

        service.GetLayerGeneralInfo = function (layerInfo, callback) {
            serviceBase.HttpRequest.Save({
                url: '/statisticalreports/GetLayerGeneralInfo',
                data: layerInfo
            }, function (response) {
                callback(response.list);
            });
        };

        service.getIndicatorsChapters = function (callback) {
            serviceBase.HttpRequest.Save({
                url: '/indicators/getChapters',
                data: {}
            }, function (response) {
                callback(response.list);
            });
        };

        service.getIndicatorsList = function (chapterNO, callback) {
            serviceBase.HttpRequest.Save({
                url: '/indicators/getIndictList',
                data: {chapterNo: chapterNO}
            }, function (response) {
                callback(response.list);
            });
        };

        service.getIndicatorResults = function (_chapterNo, _variableName, _geoCode, callback) {
            serviceBase.HttpRequest.Save({
                url: '/indicators/getResults',
                data: {lang: $rootScope.lang,chapterNo: _chapterNo, variableName: _variableName, geoCode: _geoCode}
            }, function (response) {
                callback(response.list);
            });
        };

        service.getBuildingsCountsIndicator = function (layerId, isPercentage, callback) {
            serviceBase.HttpRequest.Save({
                url: '/statisticalreports/GetBuildingsCounts',
                data: {layerId: layerId, isPercentage: isPercentage}
            }, function (response) {
                callback(response);
            });
        };

        service.getLandmarks = function (landMarkObj) {
            landMarkObj.lang = $rootScope.lang;
            var deferred = $q.defer();
            serviceBase.HttpRequest.Save({
                url: '/establishments/GetEstablishments',
                data: landMarkObj
            }, function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        service.getServicesNo = function(searchObj){
          var deferred = $q.defer();
          searchObj.lang = $rootScope.lang;
            serviceBase.HttpRequest.Save({
                url: '/establishments/GetServicesNoByLayer',
                data: searchObj
            }, function (response) {
                deferred.resolve(response.list);
            });

            return deferred.promise;
        };

        service.initialize = function () {

        };

        service.initialize();

        return service;
    }]);
