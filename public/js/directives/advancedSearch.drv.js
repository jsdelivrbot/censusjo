/**
 * Created by mmajali on 10/31/16.
 */
'use strict';

angular.module('gisapp')
    .directive('advancedSearch', function () {
        var advancedSearchCtrl = function ($rootScope, $scope, $q, $translate, esriLib, $timeout,
                                           serviceBase, generalservice, serviceData, indicatorService,
                                           serviceSearch, serviceTranslations) {

            $scope.searchLayerLevel = 9;

            function initializeLayer() {
                for (var i = 2; i <= 6; i++) {
                    $(".srchLayer" + i).hide();
                }
            }

            function manageLayersDisplay(levelNo) {

                for (var i = levelNo + 2; i <= 6; i++) {
                    $(".srchLayer" + i).hide();
                }

                $(".srchLayer" + (levelNo + 1)).show();
            }

            initializeLayer();

            function loadData() {
                serviceData.getIndicatorsChapters(function (response) {
                    $scope.indicatorChapters = response;
                    $("#indicatorChapters").niceSelect('update');
                });
            }

            loadData();

            $scope.getImageUrl = function (item) {
                var src = "img/{code}.png".format({imgUrl: item.imgUrl});
                return src;
            };

            $scope.queryOptions = {
                query: function (query) {
                    var data = {
                        results: [
                            {id: "1", text: "A"},
                            {id: "2", text: "B"}
                        ]
                    };

                    query.callback(data);
                }
            };
            $scope.servicesList = [];

            $rootScope.$on('serviceListChanged', function (event, data) {
                $scope.servicesList = data;
                $timeout(function () {
                    $("#advServicesTypes").select2({
                        placeholder: $rootScope.getField('ServiceTypesText'),
                        templateResult: getServicesIcons,
                        templateSelection: getServicesIcons,
                        dir: $rootScope.getField('dir')
                    });
                }, 500);

            });

            $rootScope.$on('GovernoratesSearch', function (event, data) {
                $scope.governoratesSearch = data;
                $timeout(function () {
                    $('.ddlNiceSelect').niceSelect();
                }, 200);
            });

            $rootScope.$on('layersDataLoaded', function (event, data) {
                $scope.searchTypesList = data.searchTypes;
                $timeout(function () {
                    $('#webmenu').msDropDown();
                }, 500);
            });

            $rootScope.$on('resetAll', function(event, data){
              $scope.selectedSearchType = undefined;
              $scope.selectedIndicatorChapter = undefined;
              $scope.selectedIndicator = undefined;
              $scope.selectedGov = undefined;
              $scope.selectedSubDistrict = undefined;
              $scope.selectedLocality = undefined;
              $scope.selectedRegion = undefined;
              $scope.selectedNH = undefined;
              $scope.selectedServices = [];
              $scope.serviceTextSearch = "";
              $scope.selectedSearch = "";
              $scope.searchLayerLevel = 9;
              manageLayersDisplay(0);

              $timeout(function(){
                $(".ddlNiceSelect").niceSelect('update');
                $("#advServicesTypes").val([]).trigger('change');
              }, 150);

            });

            $rootScope.$on('languageChanged', function (event, data) {
                $timeout(function () {
                    $(".ddlNiceSelect").niceSelect('update');
                    $("#advServicesTypes").select2({
                        placeholder: $rootScope.getField('ServiceTypesText'),
                        templateResult: getServicesIcons,
                        templateSelection: getServicesIcons,
                        dir: $rootScope.getField('dir')
                    });
                }, 500);
            });

            $scope.invalid = {
                advSearchTypeSelected: false
            };

            function resetOnLevelChange(){
              generalservice.clearSearchGraphics();
              $rootScope.$broadcast('landmarksResultsLoaded', []);
              closeResultPanel();
            }

            $scope.OnGovernorateChanged = function (_selectedGov) {

                serviceSearch.removeIndicatorsGraphics();
                resetOnLevelChange();
                if (_selectedGov && $scope.selectedSearchType === 3) {
                    if ($scope.selectedIndicator && $scope.selectedIndicator.DIST === "F") {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                    }
                }

                $scope.selectedDistrict = {};
                $scope.selectedSubDistrict = {};
                $scope.selectedLocality = {};
                $scope.selectedArea = {};
                $scope.selectedNH = {};
                if(_selectedGov){
                    $scope.searchLayerLevel = 8;
                }else{
                    $scope.searchLayerLevel = 9;
                }

                if (!_selectedGov) {
                    $rootScope.map.setExtent($rootScope.JordanExtent);
                    manageLayersDisplay(0);
                    $scope.districtsSearch = [];
                    $rootScope.map.graphics.clear();
                    return;
                }
                //else
                $scope.selectedGov = _selectedGov;
                generalservice.drawLayerGraphic($scope.selectedGov, generalservice.GetLayerObjInfo("GovernorateFeatureLayer").id);

                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("SubGovernorateFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "GOVCODE = {GovCodeVal}".format({GovCodeVal: $scope.selectedGov.attributes.GOVCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    if (featureSet.features.length > 0) {
                        manageLayersDisplay(1);
                    }
                    $scope.districtsSearch = featureSet.features;
                    $timeout(function () {
                        $('select').niceSelect('update');
                    }, 500);
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnDistirctChanged = function (_districtCode) {
                $scope.selectedSubDistrict = {};
                $scope.selectedLocality = {};
                $scope.selectedArea = {};
                $scope.selectedNH = {};
                serviceSearch.removeIndicatorsGraphics();
                resetOnLevelChange();
                if (!_districtCode || !_districtCode.attributes.DISTCODE){
                    //_districtCode.attributes.DISTCODE = "''";
                      manageLayersDisplay(1);
                      $scope.searchLayerLevel = 8;
                    return;
                }
                if ($scope.selectedSearchType === 3) {
                    if ($scope.selectedIndicator.SUBDIST === "F") {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                    }
                }
                $scope.searchLayerLevel = 7;


                $scope.selectedDistrict = _districtCode;
                generalservice.drawLayerGraphic($scope.selectedDistrict, generalservice.GetLayerObjInfo("SubGovernorateFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("DistrictFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "DISTCODE = {DistCodeVal}".format({DistCodeVal: $scope.selectedDistrict.attributes.DISTCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.subDistrictsSearch = featureSet.features;
                    manageLayersDisplay(2);
                    $timeout(function () {
                        $('select').niceSelect('update');
                    }, 500);
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnSubDistrictChanged = function (_subDistrictCode) {
                serviceSearch.removeIndicatorsGraphics();
                resetOnLevelChange();
                if ($scope.selectedSearchType === 3) {
                    if ($scope.selectedIndicator.LOC === "F") {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                    }
                }
                $scope.searchLayerLevel = 6;
                $scope.selectedLocality = {};
                $scope.selectedArea = {};
                $scope.selectedNH = {};
                if (!_subDistrictCode || !_subDistrictCode.attributes.SUBDISTCODE){
                    //_subDistrictCode.attributes.SUBDISTCODE = "''";
                    $scope.searchLayerLevel = 7;
                    manageLayersDisplay(2);
                    return;;
                }
                $scope.selectedSubDistrict = _subDistrictCode;

                generalservice.drawLayerGraphic($scope.selectedSubDistrict, generalservice.GetLayerObjInfo("DistrictFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("LocalityFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "SUBDISTCODE = {SubDistCodeVal}".format({SubDistCodeVal: $scope.selectedSubDistrict.attributes.SUBDISTCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.localitiesSearch = featureSet.features;
                    manageLayersDisplay(3);
                    $timeout(function () {
                        $('select').niceSelect('update');
                    }, 500);
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnLocalityChanged = function (_localityCode) {
                serviceSearch.removeIndicatorsGraphics();
                resetOnLevelChange();
                if ($scope.selectedSearchType === 3) {
                    if ($scope.selectedIndicator.AREA === "F") {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                    }
                }
                $scope.searchLayerLevel = 5;
                $scope.selectedArea = {};
                $scope.selectedNH = {};
                if (!_localityCode || !_localityCode.attributes.LOCCODE){
                  //_localityCode.attributes.LOCCODE = "''";
                  $scope.searchLayerLevel = 6;
                  manageLayersDisplay(3);
                  return;
                }
                $scope.selectedLocality = _localityCode;
                generalservice.drawLayerGraphic($scope.selectedLocality, generalservice.GetLayerObjInfo("LocalityFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("RegionsFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "LOCCODE = {LocCodeVal}".format({LocCodeVal: $scope.selectedLocality.attributes.LOCCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.regionsSearch = featureSet.features;
                    manageLayersDisplay(4);
                    $timeout(function () {
                        $('select').niceSelect('update');
                    }, 500);
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnRegionChanged = function (_regionCode) {
                serviceSearch.removeIndicatorsGraphics();
                resetOnLevelChange();
                if ($scope.selectedSearchType === 3) {
                    if ($scope.selectedIndicator.NIGHBORHOOD === "F") {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                    }
                }
                $scope.searchLayerLevel = 4;
                $scope.selectedNH = {};
                if (!_regionCode || !_regionCode.attributes.AREACODE){
                    //_regionCode.attributes.AREACODE = "''";
                    $scope.searchLayerLevel = 5;
                    manageLayersDisplay(4);
                    return;
                }

                $scope.selectedArea = _regionCode;
                generalservice.drawLayerGraphic($scope.selectedArea, generalservice.GetLayerObjInfo("RegionsFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("NeighborhoodsFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "AREACODE = {AreaCodeVal}".format({AreaCodeVal: $scope.selectedArea.attributes.AREACODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.neighbourhoodsSearch = featureSet.features;
                    manageLayersDisplay(5);
                    $timeout(function () {
                        $('select').niceSelect('update');
                    }, 500);
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnNeighbourhoodChanged = function (_neighbourhoodCode) {
                serviceSearch.removeIndicatorsGraphics();
                resetOnLevelChange();
                if ($scope.selectedSearchType === 3) {
                    if ($scope.selectedIndicator.NIGHBORHOOD === "F") {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                    }
                }
                $scope.searchLayerLevel = 3;
                if (!_neighbourhoodCode || !_neighbourhoodCode.attributes.NHCODE){
                    //_neighbourhoodCode.attributes.NHCODE = "''";
                    manageLayersDisplay(5);
                    $scope.searchLayerLevel = 4;
                    return;
                }
                $scope.selectedNH = _neighbourhoodCode;
                generalservice.drawLayerGraphic($scope.selectedNH, generalservice.GetLayerObjInfo("NeighborhoodsFeatureLayer").id);
            };

            $scope.OnSearchTypeChanged = function () {
                if ($scope.selectedSearchType) {
                    $scope.invalid.advSearchTypeSelected = false;
                }
            };

            $scope.OnIndicatorChapterChanged = function () {
                serviceSearch.removeIndicatorsGraphics();
                //resetOnLevelChange();
                if ($scope.selectedIndicatorChapter) {
                    $scope.invalid.advIndicatorChapter = false;
                }
                serviceData.getIndicatorsList($scope.selectedIndicatorChapter, function (response) {
                    $scope.indicatorsList = response;
                    $timeout(function () {
                        $('#indicatorDropdown').niceSelect('update');
                    }, 500);
                });
            };

            $scope.OnIndicatorChanged = function () {
                serviceSearch.removeIndicatorsGraphics();
                //resetOnLevelChange();
                if ($scope.selectedIndicator) {
                    $scope.invalid.advIndicator = false;
                }
            };

            $scope.SearchLayersDropDown = function (val) {
                if ($scope.selectedSearchType == 1) {
                    return getLandmarks(val, true);
                }
                else if ($scope.selectedSearchType == 2) {
                    return getStreets(val, true)
                }
            };

            $scope.onAdvServiceChanged = function () {
                if ($scope.selectedServices && $scope.selectedServices.length > 0) {
                    $scope.invalid.advServiceTypeSelected = false;
                }
            };

            function getLandmarks(val, isDropdown) {
                var landmarkObj = {};
                if (!$scope.selectedServices) {
                    $scope.invalid.advServiceTypeSelected = true;
                    return;
                } else {
                    $scope.invalid.advServiceTypeSelected = false;
                }
                if ($scope.selectedGov == undefined)
                    landmarkObj.govCode = '';
                else
                    landmarkObj.govCode = $scope.selectedGov.attributes.GOVCODE;

                if ($scope.selectedDistrict == undefined || $scope.selectedDistrict.attributes == undefined)
                    landmarkObj.distCode = '';
                else
                    landmarkObj.distCode = $scope.selectedDistrict.attributes.DISTCODE;

                if ($scope.selectedSubDistrict == undefined || $scope.selectedSubDistrict.attriubtes == undefined)
                    landmarkObj.subDistCode = '';
                else
                    landmarkObj.subDistCode = $scope.selectedSubDistrict.attributes.SUBDISTCODE;

                if ($scope.selectedLocality == undefined || $scope.selectedLocality.attributes == undefined)
                    landmarkObj.locCode = '';
                else
                    landmarkObj.locCode = $scope.selectedLocality.attributes.LOCCODE;

                if ($scope.selectedArea == undefined || $scope.selectedArea.attributes == undefined)
                    landmarkObj.areaCode = '';
                else
                    landmarkObj.areaCode = $scope.selectedArea.attributes.AREACODE;

                if ($scope.selectedNH == undefined || $scope.selectedNH.attributes == undefined)
                    landmarkObj.nhCode = '';
                else
                    landmarkObj.nhCode = $scope.selectedNH.attributes.NHCODE;

                landmarkObj.activityCodes = $scope.selectedServices.join();
                if (val && val.EST_NAME)
                    landmarkObj.serviceNameSearch = val.EST_NAME;
                else
                    landmarkObj.serviceNameSearch = val;

                return serviceData.getLandmarks(landmarkObj).then(function (response) {
                    serviceSearch.removeSearchGraphics();
                    if (isDropdown) {
                        return response.list;
                    } else {
                        $rootScope.$broadcast('landmarksResultsLoaded', response.list);
                        serviceSearch.addLandmarksGraphicsLayer(response.list);
                    }
                });
            }

            function getStreets(val, isDropdown) {
                var strWhere = $scope.generateStreetQuerySearch(val);
                var streetObj = generalservice.GetLayerObjInfo("RoadsFeatureLayer");
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(streetObj.id),
                    outFields: ["*"],
                    strWhere: strWhere,
                    returnGeometry: true
                }

                return esriLib.InvokeQueryTask(QueryTaskOpts, false, function (featureSet) {
                    var _featureResult = featureSet.features;
                    // returning search dropdown
                    if (isDropdown)
                        return _featureResult;
                    else {
                        serviceSearch.addStreetsGraphicLayer(_featureResult);
                        $rootScope.$broadcast('streetsResultsLoaded', _featureResult);
                    }
                }).then(function (result) {
                    return result.cbFN(result.response);
                });
            }

            $scope.ZoomToSelected = function ($item, $model, $label, $event) {
                //serviceSearch.removeSearchGraphics();
                var _infoTemplate = esriLib.GetInfoTemplate("${{LayerName}}".format({LayerName: $rootScope.LayerAttributeName}), "${*}");
                var _symbol;
                switch ($item.geometry.type) {
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

                //serviceSearch.removeSearchGraphics();
                if ($scope.selectedSearchType == 1) {
                    var graphic = esriLib.CreateGraphic($item.geometry, _symbol, $scope.selectedSearch.attributes, _infoTemplate);

                    graphic.attributes = {'id': '_advLandmark'};
                    $rootScope.map.graphics.add(graphic);
                }

                if ($scope.selectedSearchType == 2) {
                    var textSymbol;
                    var length = $item.geometry.paths[0].length;
                    var angle = computeAngle($item.geometry.paths[0][0], $item.geometry.paths[0][length - 1]);
                    textSymbol = new esriLib.CreateTextSymbol($item.attributes[$rootScope.getField('LayerAttributeName')], [0, 0, 250, 255], "10pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                    textSymbol.setAngle(angle);
                    var textGraphic = new esriLib.CreateGraphic($item.geometry.getExtent().getCenter(), textSymbol);
                    textGraphic.attributes = {'id': '_advStreet'};
                    $rootScope.map.graphics.add(textGraphic);
                }

                switch ($item.geometry.type) {
                    case "point":
                        $rootScope.map.centerAndZoom($item.geometry, 18);
                        break;
                    case "polygon":
                        $rootScope.map.setExtent($item.geometry.getExtent(), true);
                        break;
                    case "polyline":
                        $rootScope.map.setExtent($item.geometry.getExtent(), true);
                        //$rootScope.map.setZoom(19);
                        break;
                }
            };

            $scope.ZoomToLandmark = function ($item, $model, $label, $event) {
                serviceSearch.removeSearchGraphics();
                var point = esriLib.CreatePoint($item.GPS_Y, $item.GPS_X, null);
                var _symbol = esriLib.GetPictureMarkerSymbol(generalservice.GetServicesMapIcons($item.ACTIVITY_CODE2), "image/png", 18, 18);
                var _infoTemplate = esriLib.GetInfoTemplate("", "test".format({landmarkName: $item.EST_NAME}));
                var graphic = esriLib.CreateGraphic(point, _symbol);
                graphic.attributes = {'id': '_advLandmark', EST_NAME: $item.EST_NAME};
                $rootScope.map.graphics.add(graphic);
                $rootScope.map.centerAndZoom(graphic.geometry, 18);
                //var dialog;

            };

            $scope.generateStreetQuerySearch = function(text){
                var strWhere = "{LayerAttrName} like '%{SearchVal}%'".format({
                    SearchVal: text,
                    LayerAttrName: $rootScope.getField('LayerAttributeName')});
                  switch ($scope.searchLayerLevel) {
                    case 8:
                        strWhere = "{strWhere} AND GOVCODE = '{GOVCODE}'".format({strWhere: strWhere, GOVCODE: $scope.selectedGov.attributes.GOVCODE});
                        break;
                    case 7:
                        strWhere = "{strWhere} AND DISTCODE = '{DISTCODE}'".format({strWhere: strWhere, DISTCODE: $scope.selectedDistrict.attributes.DISTCODE});
                        break;
                    case 6:
                        strWhere = "{strWhere} AND SUBDISTCODE = '{SUBDISTCODE}'".format({strWhere: strWhere, SUBDISTCODE: $scope.selectedSubDistrict.attributes.SUBDISTCODE});
                        break;
                    case 5:
                        strWhere = "{strWhere} AND LOCCODE = '{LOCCODE}'".format({strWhere: strWhere, LOCCODE: $scope.selectedLocality.attributes.LOCCODE});
                        break;
                    case 4:
                        strWhere = "{strWhere} AND AREACODE = '{AREACODE}'".format({strWhere: strWhere, AREACODE: $scope.selectedArea.attributes.AREACODE});
                        break;
                    case 3:
                        strWhere = "{strWhere} AND NHCODE = '{NHCODE}'".format({strWhere: strWhere, NHCODE: $scope.selectedNH.attributes.NHCODE});
                        break;

                  }
                  return strWhere;
            };

            $scope.SubmitAdvancedSearch = function () {
                if ($scope.selectedSearchType == 1 || $scope.selectedSearchType == 2) {
                    serviceSearch.removeSearchGraphics();
                }

                if (!$scope.selectedSearchType) {
                    $scope.invalid.advSearchTypeSelected = true;
                }

                if ($scope.selectedSearchType == 1) {
                    getLandmarks($scope.serviceTextSearch, false);
                } else if ($scope.selectedSearchType == 2) {
                    if ($scope.selectedSearch.attributes) {
                        $scope.selectedSearch = $scope.selectedSearch.attributes[$rootScope.getField('LayerAttributeName')];
                    }
                    getStreets($scope.selectedSearch, false);
                } else if ($scope.selectedSearchType === 3) {
                    if (!$scope.selectedIndicatorChapter) {
                        $scope.invalid.advIndicatorChapter = true;
                        return;
                    } else {
                        $scope.invalid.advIndicatorChapter = false;
                        if (!$scope.selectedIndicator) {
                            $scope.invalid.advIndicator = true;
                        }
                    }
                    var noIndicatorflag = false;
                    var geoCode;
                    switch ($scope.searchLayerLevel) {
                        case 9:
                            if ($scope.selectedIndicator.GOV === "F") {
                                noIndicatorflag = true;
                            } else {
                                if ($scope.selectedGov)
                                    geoCode = $scope.selectedGov.attributes.GOVCODE;
                                else
                                    geoCode = -1;
                            }
                            break;
                        case 8:
                            if ($scope.selectedIndicator.DIST === "F") {
                                noIndicatorflag = true;
                            } else {
                                if ($scope.selectedGov)
                                    geoCode = $scope.selectedGov.attributes.GOVCODE;
                                else
                                    geoCode = -1;
                            }
                            break;
                        case 7:
                            if ($scope.selectedIndicator.SUBDIST === "F") {
                                noIndicatorflag = true;
                            } else {
                                try{
                                    geoCode = $scope.selectedDistrict.attributes.DISTCODE;
                                }catch(ex){
                                    geoCode = -1;
                                }
                            }
                            break;
                        case 6:
                            if ($scope.selectedIndicator.LOC === "F") {
                                noIndicatorflag = true;
                            } else {
                                try{
                                    geoCode = $scope.selectedSubDistrict.attributes.SUBDISTCODE
                                }catch(ex){
                                    geoCode = -1;
                                }
                            }
                            break;
                        case 5:
                            if ($scope.selectedIndicator.AREA === "F") {
                                noIndicatorflag = true;
                            } else {
                                geoCode = $scope.selectedLocality.attributes.LOCCODE;
                            }
                            break;
                        case 4:
                            if ($scope.selectedIndicator.NIGHBORHOOD === "F")
                                noIndicatorflag = true;
                            else {
                                geoCode = $scope.selectedArea.attributes.AREACODE;
                            }
                            break;
                        case 3:
                            if ($scope.selectedIndicator.NIGHBORHOOD === "F")
                                noIndicatorflag = true;
                            else {
                                geoCode = $scope.selectedNH.attributes.NHCODE;
                            }
                            break;
                    }
                    if (noIndicatorflag) {
                        serviceBase.showInfoNotification($rootScope.getField('indicatorsText'), $rootScope.getField('indicatorLayerNotification'));
                        return;
                    } else {
                        openIndicatorResultPanel();
                        var searchLevelNo;
                        if(geoCode != -1){
                            searchLevelNo = $scope.searchLayerLevel - 1;
                        }else {
                            searchLevelNo = 8;
                        }
                        indicatorService.setIndicatorValues(searchLevelNo, $scope.selectedIndicatorChapter, $scope.selectedIndicator.VARIABLE_NAME,
                            parseInt(geoCode));
                        indicatorService.generateIndicator();
                    }
                }
            };
        };

        return {
            require: '^advancedSearch',
            restrict: 'E',
            templateUrl: 'views/tpl/advancedSearch.tpl.html',
            controller: advancedSearchCtrl
        }

    });
