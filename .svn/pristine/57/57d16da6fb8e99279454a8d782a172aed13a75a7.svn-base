/**
 * Created by mmajali on 11/11/16.
 */
'use strict';
angular.module('gisapp')
    .directive('measurement', function () {
        var ctrl = function ($rootScope, $scope, esriLib) {
            $(window).load(function () {
                esriLib.createMeasurementTools('dvMeasurementTool');
            });
        };

        return {
            restrict: 'E',
            templateUrl: 'views/tpl/measurement.tpl.html',
            controller: ctrl
        }
    });
