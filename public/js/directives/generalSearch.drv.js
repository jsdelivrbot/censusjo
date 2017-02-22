/**
 * Created by mmajali on 11/8/16.
 */
'use strict';

angular.module('gisapp')
    .directive('generalSearch', function () {
        var ctrl = function ($rootScope, $scope, $q, $timeout, esriLib, serviceData, generalservice, serviceSearch) {
            $scope.generalSelectedSearchType = -1;


            $scope.isSearchTypeSelected = function (type) {
                return $scope.generalSelectedSearchType == type;
            };

            $scope.setSearchType = function (type) {
                $scope.generalSelectedSearchType = type;
            };

            $rootScope.$on('serviceListChanged', function (event, data) {
                $scope.generalServicesList = data;
                $timeout(function () {
                    $("#generalServicesTypes").select2({
                        placeholder: $rootScope.ServiceTypesText,
                        dir: "rtl",
                        templateResult: getServicesIcons,
                        templateSelection: getServicesIcons
                    });
                }, 500);
            });

            function getLandmarks(val, isDropdown) {
                var landmarkObj = {};

                landmarkObj.govCode = '';
                landmarkObj.distCode = '';
                landmarkObj.subDistCode = '';
                landmarkObj.locCode = '';
                landmarkObj.areaCode = '';
                landmarkObj.nhCode = '';

                landmarkObj.activityCodes = $scope.generalSelectedServices.join();
                if(val && val.EST_NAME)
                    landmarkObj.serviceNameSearch = val.EST_NAME;
                else
                    landmarkObj.serviceNameSearch = val;

                serviceSearch.removeSearchGraphics();
                serviceSearch.removeIndicatorsGraphics();
                return serviceData.getLandmarks(landmarkObj).then(function (response) {
                    if (isDropdown) {
                        return response.list;
                    } else {
                        $rootScope.$broadcast('landmarksResultsLoaded', response.list);

                        serviceSearch.addLandmarksGraphicsLayer(response.list);

                        //var graphicsExtent = esriLib.GetGraphicsExtent($rootScope.map.graphics);
                        //$rootScope.map.setExtent(graphicsExtent, true);
                    }
                });
            }

            $scope.GetLayerAttributeAliasName = function () {
                return $rootScope.getField('layerAttributeAliasName');
            };

            function getLayersInfo(val, isDropdown) {
                var findTaskParam = {};
                var text = "";
                if(val.value){
                  text = val.value;
                }else{
                  text = val;
                }
                findTaskParam.url = GetBaseMapServerUrl();
                findTaskParam.layersIds = [8, 7, 6, 5, 4, 3];
                findTaskParam.searchFields = [$rootScope.getField('LayerAttributeName')];
                findTaskParam.searchText = text;
                findTaskParam.returnGeometry = true;

                serviceSearch.removeSearchGraphics();
                serviceSearch.removeIndicatorsGraphics();
                return esriLib.InvokeFindTask(findTaskParam, false, function (featureSet) {
                    var _featureResult = featureSet;
                    _featureResult = _.map(featureSet, function (item) {
                        var layerObj = generalservice.GetLayerInfoById(item.layerId);
                        item.layerName = layerObj[$rootScope.getField('DisplayLayers')];
                        return item;
                    });
                    if (!isDropdown) {
                        $rootScope.$broadcast('layersSearchResultsLoaded', _featureResult);
                        var extentGraphics = _.map(_featureResult, function(item){
                          return item.feature;
                        });
                        var graphicsExtent = esriLib.GetGraphicsExtent(extentGraphics);
                        $rootScope.map.setExtent(graphicsExtent, true);
                    }
                    return _featureResult;
                }).then(function (result) {
                    return result.cbFN(result.response);
                });
            }

            function getStreets(val, isDropdown) {
                var searchText = '';
                if(val.attributes){
                  searchText = val.attributes[ $rootScope.getField('LayerAttributeName')];
                }else{
                  searchText = val;
                }
                var streetObj = generalservice.GetLayerObjInfo("RoadsFeatureLayer");
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(streetObj.id),
                    outFields: ["*"],
                    strWhere: "{LayerAttrName} like '%{SearchVal}%'".format({
                        SearchVal: searchText,
                        LayerAttrName: $rootScope.getField('LayerAttributeName')
                    }),
                    returnGeometry: true
                }

                serviceSearch.removeSearchGraphics();
                serviceSearch.removeIndicatorsGraphics();
                return esriLib.InvokeQueryTask(QueryTaskOpts, false, function (featureSet) {
                    var _featureResult = featureSet.features;
                    // returning search dropdown
                    if (isDropdown)
                        return _featureResult;
                    else {
                        var graphics = _.map(_featureResult, function(item){
                          return item.geometry;
                        });
                        var graphicsExtent = esriLib.GetGraphicsExtent(_featureResult);
                        $rootScope.map.setExtent(graphicsExtent, true);
                        generalservice.addStreetsGraphicLayer(_featureResult);
                        $rootScope.$broadcast('streetsResultsLoaded', _featureResult);
                    }
                }).then(function (result) {
                    return result.cbFN(result.response);
                });
            }

            $scope.generalSearchLayersDropDown = function (val) {
                switch ($scope.generalSelectedSearchType) {
                    case 1:
                        return getLayersInfo(val, true);
                        break;
                    case 2:
                        return getStreets(val, true);
                        break;
                    case 3:
                        return getLandmarks(val, true);
                        break;
                }
            };

            $scope.generalZoomToSelected = function ($item, $model, $label, $event) {
                serviceSearch.removeSearchGraphics();
                var _infoTemplate, _symbol, type, geometry;

                if ($scope.generalSelectedSearchType == 1) {
                    type = $item.feature.geometry.type;
                    geometry = $item.feature.geometry;
                    _infoTemplate = esriLib.GetInfoTemplate($item.feature.attributes[$rootScope.getField('LayerAttributeName')], "${*}");
                } else {
                    type = $item.geometry.type;
                    _infoTemplate = esriLib.GetInfoTemplate("${{LayerName}}".format({LayerName: $rootScope.getField('LayerAttributeName')}), "${*}");
                }
                switch (type) {
                    case "point":
                        _symbol = esriLib.GetPictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png", "image/png", 24, 24);
                        break;
                    case "polygon":
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID", [150, 120, 245, 4], 2, [50, 125, 125, 0.35]);
                        break;
                    case "polyline":

                        _symbol = esriLib.GetSimpleLineSymbol("STYLE_SOLID", [22, 217, 217, 0.5], 3);
                        break;
                }
                //var _point = esriLib.CreatePoint(result[0].x, result[0].y, result[0].spatialReference);
                serviceSearch.removeSearchGraphics();
                if ($scope.generalSelectedSearchType == 1) {
                    var graphic = esriLib.CreateGraphic(geometry, _symbol, $scope.generalSelectedSearch.attributes, _infoTemplate);
                    $rootScope.map.graphics.clear();
                    graphic.attributes = {'id': '_normal'};
                    $rootScope.map.graphics.add(graphic);
                }

                if ($scope.generalSelectedSearchType == 2) {
                    var textSymbol;
                    textSymbol = new esriLib.CreateTextSymbol($item.attributes[$rootScope.getField('LayerAttributeName')], [0, 0, 250, 255], "10pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                    var length = $item.geometry.paths[0].length;
                    var angle = computeAngle($item.geometry.paths[0][0], $item.geometry.paths[0][length - 1]);
                    textSymbol.setAngle(angle);
                    var textGraphic = new esriLib.CreateGraphic($item.geometry.getExtent().getCenter(), textSymbol);
                    textGraphic.attributes = {'id': '_advStreet'};
                    $rootScope.map.graphics.add(textGraphic);
                }

                var geometry;
                if($item.feature){
                  geometry = $item.feature.geometry;
                }else{
                  geometry = $item.geometry;
                }

                switch (type) {
                    case "point":
                        $rootScope.map.centerAndZoom(geometry, 18);
                        break;
                    case "polygon":
                        $rootScope.map.setExtent(geometry.getExtent(), true);
                        break;
                    case "polyline":
                        $rootScope.map.setExtent(geometry.getExtent(), true);
                        break;
                }
            };

            $scope.generalZoomToLandmark = function ($item, $model, $label, $event) {
                serviceSearch.removeSearchGraphics();
                serviceSearch.removeIndicatorsGraphics();
                var point = esriLib.CreatePoint($item.GPS_Y, $item.GPS_X, null);
                var _symbol = esriLib.GetPictureMarkerSymbol(generalservice.GetServicesMapIcons($item.ACTIVITY_CODE2), "image/png", 18, 18);
                var graphic = esriLib.CreateGraphic(point, _symbol);
                graphic.attributes = {'id': '_landmark'};
                $rootScope.map.graphics.add(graphic);
                $rootScope.map.centerAndZoom(graphic.geometry, 18);
                /*$rootScope.map.graphics.on('mouse-over', function (evt) {

                 dialog.setContent($item.EST_NAME);
                 esriLib.openDialog(dialog, evt);
                 });

                 $rootScope.map.graphics.on("mouse-out", function (evt) {
                 esriLib.closeDialog(dialog);
                 });*/
            };

            $scope.generalSearchSubmit = function () {
                serviceSearch.removeSearchGraphics();
                serviceSearch.removeIndicatorsGraphics();
                //RemoveSearchGraphicLayers();
                switch ($scope.generalSelectedSearchType) {
                    case 1:
                        if ($scope.generalSelectedSearch.attributes) {
                            $scope.generalSelectedSearch.attributes[$rootScope.getField('LayerAttributeName')];
                        }
                        getLayersInfo($scope.generalSelectedSearch, false);
                        break;
                    case 2:
                        if ($scope.generalSelectedSearch.attributes) {
                            $scope.generalSelectedSearch.attributes[$rootScope.getField('LayerAttributeName')];
                        }
                        getStreets($scope.generalSelectedSearch, false);
                        break;
                    case 3:
                        getLandmarks($scope.generalServiceTextSearch, false);
                        break;
                }
            };
        };
        return {
            require: '^generalSearch',
            restrict: 'E',
            templateUrl: 'views/tpl/generalSearch.tpl.html',
            controller: ctrl
        }
    });
