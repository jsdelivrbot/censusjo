/**
 * Created by mmajali on 10/16/16.
 */
'use strict';
angular.module('gisapp')
    .directive('drawingTools', function ($rootScope, $timeout, esriLib, generalservice,
                                         serviceData, serviceBase, serviceSearch) {
        return {
            restrict: 'E',
            templateUrl: 'views/tpl/drawingBtns.tpl.html',
            link: function (scope, element, attrs) {
                var drawingToolBar;
                scope.bufferDistance = 0;
                scope.selectedDrawingToolIndex = -1;

                var drawingTools = [];

                scope.isSelectedDrawingToolIndex = function(index){
                    return index === scope.selectedDrawingToolIndex;
                }

                scope.setSelectedDrawingToolIndex = function(index){
                    scope.selectedDrawingToolIndex = index;
                }

                scope.activateDrawingTool = function (index) {
                    scope.cancelDrawing();
                    drawingToolBar.activate(drawingTools[index]);
                    generalservice.isSearchNearestServiceEnabled = false;
                    //$rootScope.map.hideZoomSlider();
                };

                scope.activateBuffer = function () {
                    generalservice.isSearchNearestServiceEnabled = true;
                    generalservice.bufferDistance = scope.bufferDistance;
                };

                scope.cancelDrawing = function () {
                    generalservice.isSearchNearestServiceEnabled = false;
                    drawingToolBar.deactivate();
                    $rootScope.map.graphics.clear();
                    serviceSearch.removeSearchGraphics();
                    $rootScope.$broadcast('landmarksResultsLoaded', []);
                    scope.selectedDrawingToolIndex = -1;
                };

                $rootScope.$on('resetAll', function(event, data){
                  scope.drawingSelectedServices = undefined;
                  scope.bufferDistance = 0;
                  generalservice.isSearchNearestServiceEnabled = false;
                  //$rootScope.$broadcast('landmarksResultsLoaded', []);
                  scope.selectedDrawingToolIndex = -1;
                  drawingToolBar.deactivate();
                  $timeout(function(){
                    $("#drawingServices").select2().val([]).trigger('change');
                  }, 150)
                });

                $rootScope.$on('serviceListChanged', function (event, data) {
                    scope.drawingServicesList = data;
                    $timeout(function () {
                        $("#drawingServices").select2({
                            placeholder: $rootScope.getField('ServiceTypesText'),
                            dir: "rtl",
                            templateResult: getServicesIcons,
                            templateSelection: getServicesIcons
                        });
                    }, 500);
                });

                $rootScope.$on('languageChanged', function (event, data) {
                    $timeout(function () {
                        $("#drawingServices").select2({
                            placeholder: $rootScope.getField('ServiceTypesText'),
                            templateResult: getServicesIcons,
                            templateSelection: getServicesIcons,
                            dir: $rootScope.getField('dir')
                        });
                    }, 500);
                });

                $rootScope.$on('bufferSearchClicked', function (event, data) {
                    scope.BufferCircle = esriLib.ReturnBufferCircle(data, generalservice.bufferDistance);
                    $rootScope.map.graphics.clear();
                    $rootScope.map.infoWindow.hide();
                    var circleSymbol = esriLib.GetSimpleFillSymbol('STYLE_SOLID', 'STYLE_SOLID', [255, 0, 0], 2, [125, 125, 125, 0.35]);
                    var bufferGraphic = esriLib.CreateGraphic(scope.BufferCircle, circleSymbol);
                    $rootScope.map.graphics.add(bufferGraphic);
                    queryForData(scope.BufferCircle);
                });

                $rootScope.$on('mapLoaded', function (event, flag) {
                    if (flag) {
                        drawingTools = esriLib.returnDrawingTools();
                        drawingToolBar = esriLib.createDrawToolbar($rootScope.map);
                        drawingToolBar.on("draw-end", drawGraphics);
                    }
                });

                function drawGraphics(evt) {
                    serviceSearch.removeSearchGraphics();
                    serviceSearch.removeIndicatorsGraphics();

                    var symbol;
                    switch (evt.geometry.type) {
                        case "point":
                        case "multipoint":
                            symbol = esriLib.GetSimpleMarkerSymbolEmptyObj();
                            break;
                        case "polyline":
                            symbol = esriLib.CreateSimpleLineRenderer("STYLE_SOLID", [255, 0, 0, 0.5], 3);
                            break;
                        default:
                            symbol = esriLib.GetSimpleFillSymbol('STYLE_SOLID', 'STYLE_SOLID', [255, 0, 0], 2, [125, 125, 125, 0.35]);
                            break;
                    }
                    var graphic = esriLib.CreateGraphic(evt.geometry, symbol);
                    $rootScope.map.graphics.add(graphic);
                    queryForData(evt.geometry);
                }

                function queryForData(extent) {
                    var landmarkObj = {};

                    if(scope.drawingSelectedServices == undefined
                        || scope.drawingSelectedServices.length == 0){
                        serviceBase.showWarningNotification($rootScope.getField('searchByDrawing'), $rootScope.getField('selectSearchTypeWarning'));
                        $rootScope.map.graphics.clear();
                        return;
                    }
                    drawingToolBar.deactivate();
                    landmarkObj.govCode = '';
                    landmarkObj.distCode = '';
                    landmarkObj.subDistCode = '';
                    landmarkObj.locCode = '';
                    landmarkObj.areaCode = '';
                    landmarkObj.nhCode = '';
                    landmarkObj.activityCodes = scope.drawingSelectedServices.join();
                    landmarkObj.serviceNameSearch = '';

                    serviceData.getLandmarks(landmarkObj).then(function (response) {
                        var selectedLandmarks = _.filter(response.list, function (estObj) {
                            var point = esriLib.CreatePoint(estObj.GPS_Y, estObj.GPS_X, null);
                            return extent.contains(point);
                        });
                        _.each(selectedLandmarks, function (estObj) {
                            var point = esriLib.CreatePoint(estObj.GPS_Y, estObj.GPS_X, null);
                            var _symbol = esriLib.GetPictureMarkerSymbol(generalservice.GetServicesMapIcons(estObj.ACTIVITY_CODE2), "image/png", 18, 18);
                            var graphic = esriLib.CreateGraphic(point, _symbol);
                            graphic.attributes = {'id': '_drwLandmark'};
                            $rootScope.map.graphics.add(graphic);
                        });
                        $rootScope.$broadcast('landmarksResultsLoaded', selectedLandmarks);
                        scope.selectedDrawingToolIndex = -1;
                    });
                }
            }
        }
    });
