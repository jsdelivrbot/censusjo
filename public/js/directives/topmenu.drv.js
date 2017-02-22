/**
 * Created by mmajali on 10/23/16.
 */
'use strict';

angular.module('gisapp')
    .directive('topMenu', function () {
        var topMenuCtrl = function ($rootScope, $scope, $q, $translate, esriLib, $timeout,
                                    serviceBase, generalservice, serviceData, serviceTranslations) {
            $scope.resetAll = function(){
                generalservice.resetAll();
            };
        }

        return {
            require: '^topMenu',
            restrict: 'E',
            templateUrl: 'views/tpl/topmenu.tpl.html',
            controller: topMenuCtrl
        }
    });
