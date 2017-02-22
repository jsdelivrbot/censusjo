/**
 * Created by mmajali on 11/17/16.
 */
'use strict';
angular.module('gisapp')
    .factory('serviceTranslations', function ($rootScope) {
        var service = {};
        service.translations = [];

        service.set = function(translations){
            service.translations = translations;
        };

        $rootScope.getField = function(fieldName){
            return service.translations[fieldName];
        };

        return service;
    });
