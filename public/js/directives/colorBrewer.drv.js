/**
 * Created by mmajali on 10/30/16.
 */
'use strict';

angular.module('gisapp')
    .directive('colorBrewer', function ($rootScope, serviceData, indicatorService) {

        return {
            restrict: 'EA',
            templateUrl: 'views/tpl/colorBrewer.tpl.html',
            controller: function ($rootScope, $scope, serviceData) {
                $scope.classNo = 4;
                indicatorService.setClassificationNo($scope.classNo);

                $scope.init = function () {
                    serviceData.loadColorBrewer(function (response) {
                        $scope.mainColorBrewer = response;
                        $scope.colorBrewer = _.map($scope.mainColorBrewer, function (value, key) {

                            var obj = {};
                            obj = {name: key, rgb: $scope.mainColorBrewer[key][$scope.classNo]};
                            //obj[key] = $scope.colorBrewer[key][$scope.classNo];
                            return obj;
                        });
                        $scope.colorBrewer = _.filter($scope.colorBrewer, function(item){
                            return item.rgb !== undefined;
                        });
                        $scope.chosenColorBrewer = $scope.colorBrewer[0];
                        indicatorService.setRGBArray($scope.chosenColorBrewer.rgb);
                    });
                };

                $scope.chooseColorBrewer = function (name) {
                    try {
                        $scope.chosenColorBrewer = _.find($scope.colorBrewer, {name: name});
                        $rootScope.$broadcast('colorBrewerChanged', {rgb: $scope.chosenColorBrewer.rgb});
                    } catch (ex) {

                    }
                };

                $scope.$watch('classNo', function (no) {
                    $scope.colorBrewer = _.map($scope.mainColorBrewer, function (value, key) {
                        var obj = {};
                        obj = {name: key, rgb: $scope.mainColorBrewer[key][no]};
                        //obj[key] = $scope.colorBrewer[key][$scope.classNo];
                        return obj;
                    });

                    if ($scope.colorBrewer.length > 0) {
                        $scope.chosenColorBrewer = _.find($scope.colorBrewer, {name: $scope.chosenColorBrewer.name});
                        $rootScope.$broadcast('classificationNoChanged', {
                            classNo: no,
                            rgb: $scope.chosenColorBrewer.rgb
                        });
                    }
                });

                $scope.init();
            },
            link: function (scope, element, attrs) {

            }
        }
    });
