/**
 * Created by mmajali on 11/10/16.
 */
'use strict';
angular.module('gisapp')
    .directive('print', function(){

        var printCtrl = function($rootScope, $scope, $timeout, esriLib, blockUI){
            $scope.printLayouts = ["MAP_ONLY",
                "A3 Landscape",
                "A3 Portrait",
                "A4 Landscape",
                "A4 Portrait",
                "Letter ANSI A Landscape",
                "Letter ANSI A Portrait",
                "Tabloid ANSI B Landscape",
                "Tabloid ANSI B Portrait"];

            $scope.printFormats = ["pdf", "png32", "png8", "jpg", "gif", "eps", "svg", "svgz"];

            $timeout(function () {
                $("#ddlPrintTemplates").niceSelect();
                $("#ddlPrintFormat").niceSelect();
            }, 500);

            $scope.printMap = function(){
                blockUI.start();
                esriLib.generatePrintTask($scope.selectedPrintLayout, $scope.selectedPrintFormat,function(response){
                    blockUI.stop();
                    window.open(response.url, "_blank")
                });
            };
        };

        return {
            restrict: 'EA',
            templateUrl: 'views/tpl/print.tpl.html',
            controller: printCtrl
        }
    });
