'use strict'
angular.module('gisapp')
    .factory('generalservice', ['$rootScope', '$translate', 'blockUI', 'serviceBase', 'serviceData', 'esriLib', 'serviceTranslations',
        function ($rootScope, $translate, blockUI, serviceBase, serviceData, esriLib, serviceTranslations) {
            var service = {};

            // variables
            service.isSearchNearestServiceEnabled = false;
            service.bufferDistance = 0;
            service.SelectedNearestServiceType = {};

            service.login = function (UserObj, callback) {
                serviceBase.HttpRequest.Save({url: '/user/login', data: UserObj}, function (response) {
                    callback(response);
                });
            };

            $translate(['QueryTaskTitle', 'QueryTaskFailedMsg', 'AllText', 'SelectText', 'NoResultFound', 'LayersText', 'LayerText', 'NameText', 'DisplayLayers', 'LayerAttributeName', 'AdvancedSearchText',
                'SearchText', 'SelectLayerText', 'ZOOM_IN', 'ZOOM_OUT', 'FULL_EXTENT', 'PREV_EXTENT', 'NEXT_EXTENT', 'PAN',
                'DEACTIVATE', 'ServiceTypesText', 'GovernorateText', 'SubGovernorateText', 'DistrictText',
                'LocalityText', 'SearchTypeText', 'RegionText', 'NeighbourhoodText', 'ServicesNumberText',
                'FromText', 'ToText', 'SearchNearServices', 'DistanceOfSearchKiloMeterText', 'SearchResultsText', 'StatisticalReports',
                'NumberOfMatchedServicesText', 'ActivateBufferSearchText', 'AttributeName',
                'SelectLayerWarning', 'Login', 'ShowHideLayersText', 'StatisticalReports',
                'BuildingCntText', 'HousingCntText', 'FamilyCntText', 'PopulationCtnText',
                'JordanPopulationText', 'NonJordanianPopulationText', 'EstablishmentsCntText', 'refreshText',
                'arialText', 'arialWithLabelsText', 'mapText', 'percentageValue', 'showText', 'requiredText',
                'requiredDropDown', 'measurementTools', 'searchByDrawing', 'paintingLayers', 'indicatorText',
                'indicatorNameText', "indicatorResultsText", "classificationNoText", "indicatorsText",
                "indicatorLayerNotification", "PrintText", "layerAttributeAliasName",
                "selectSearchTypeWarning", "fieldName", "goToBaseMap", "serviceName",
                "dir", "selectColorArea", "drawByLine", "drawByTriangle", "drawByRectangle",
                "drawByPolygon", "drawByCircle", "searchLayers", "searchLandmarks", "searchStreets",
                "chapterName", "IndicatorVal", "directorateName", "indicatorName", "fontFamily", "fontSize",
                "fontWeight", "POP_MALE_TOT", "POP_FEMALE_TOT", "EST_NAME", "ContactUsText"]).then(function (translations) {
                serviceTranslations.set(translations);
            });

            $rootScope.ChangeLang = function () {

                switch ($rootScope.lang) {
                    case 'en':
                        $rootScope.lang = 'ar';
                        $('#rtlCSS').prop('disabled', false);
                        $('#ltrCSS').prop('disabled', true);
                        break;
                    case 'ar':
                        $rootScope.lang = 'en';
                        $('#rtlCSS').prop('disabled', true);
                        $('#ltrCSS').prop('disabled', false);
                        break;
                }
                $translate.use($rootScope.lang);

            }

            $rootScope.$on('$translateChangeSuccess', function (event, data) {
                var language = data.language;
                $rootScope.lang = language;
                $translate(['QueryTaskTitle', 'QueryTaskFailedMsg', 'AllText', 'SelectText', 'NoResultFound', 'LayersText', 'LayerText', 'NameText', 'DisplayLayers', 'LayerAttributeName', 'AdvancedSearchText',
                    'SearchText', 'SelectLayerText', 'ZOOM_IN', 'ZOOM_OUT', 'FULL_EXTENT', 'PREV_EXTENT', 'NEXT_EXTENT', 'PAN',
                    'DEACTIVATE', 'ServiceTypesText', 'GovernorateText', 'SubGovernorateText', 'DistrictText',
                    'LocalityText', 'SearchTypeText', 'RegionText', 'NeighbourhoodText', 'ServicesNumberText',
                    'FromText', 'ToText', 'SearchNearServices', 'DistanceOfSearchKiloMeterText', 'SearchResultsText', 'StatisticalReports',
                    'NumberOfMatchedServicesText', 'ActivateBufferSearchText', 'AttributeName', 'refreshText',
                    'SelectLayerWarning', 'Login', 'ShowHideLayersText', 'StatisticalReports',
                    'arialText', 'arialWithLabelsText', 'mapText', 'percentageValue', 'showText',
                    'requiredText', 'requiredDropDown', 'measurementTools', 'searchByDrawing',
                    'paintingLayers', 'indicatorText', 'indicatorNameText', "indicatorResultsText",
                    "classificationNoText", "indicatorsText", "indicatorLayerNotification", "PrintText",
                    "layerAttributeAliasName", "selectSearchTypeWarning", "fieldName", "goToBaseMap",
                    "serviceName", "dir", "selectColorArea",
                    'BuildingCntText', 'HousingCntText', 'FamilyCntText', 'PopulationCtnText',
                    "drawByLine", "drawByTriangle", "drawByRectangle", "drawByPolygon", "drawByCircle",
                    "searchLayers", "searchLandmarks", "searchStreets", "chapterName", "IndicatorVal", "directorateName", "indicatorName",
                    "fontFamily", "fontSize", "fontWeight", "POP_MALE_TOT", "POP_FEMALE_TOT","EST_NAME", "ContactUsText"]).then(function (translations) {
                    serviceTranslations.set(translations);
                    $rootScope.$broadcast('languageChanged', $rootScope.lang);
                });
            });

            service.ClearGraphics = function () {
                $rootScope.map.graphics.clear();
            };

            service.clearSearchGraphics = function () {
              try{
                var graphicsList = _.filter($rootScope.map.graphics.graphics, function (graphic) {
                    return graphic.attributes.id === '_advLandmark' || graphic.attributes.id === '_normalSearch'
                    || graphic.attributes.id === '_advStreets';
                });
                _.each(graphicsList, function (g) {
                    $rootScope.map.graphics.remove(g);
                });

                if($rootScope.map.infoWindow) {
                    $rootScope.map.infoWindow.hide();
                }

                service.ClearGraphics();

                  $rootScope.map.removeLayer($rootScope.map.getLayer('streetsGraphicsLayer'));
                }catch(ex){

                }
            };

            service.resetAll = function(){
                service.removeIndicatorsGraphics();
                service.ClearGraphics();
                service.clearSearchGraphics();
                $rootScope.$broadcast('resetAll', true);
                closeResultPanel();
            };

            service.clearRemoveSearchGraphicLayers = function () {
                var layer = $rootScope.map.getLayer("_advStreets");
                if (layer)
                    $rootScope.map.removeLayer(layer);
                layer = $rootScope.map.getLayer("_advLandmark");
                if (layer)
                    $rootScope.map.removeLayer(layer);
                layer = $rootScope.map.getLayer('_normalSearch');
                if (layer)
                    $rootScope.map.removeLayer(layer);
            };

            service.removeIndicatorsGraphics = function () {
                var layer = $rootScope.map.getLayer("_indicatorGraphics");
                if (layer)
                    $rootScope.map.removeLayer(layer);
            };

            service.cleanUp = function () {
                service.ClearGraphics();
                $rootScope.map.infoWindow.hide();
            };

            service.loadInitializationData = function (callback) {
                async.waterfall([
                        function (callback) {
                            serviceData.loadLayers(function (response) {
                                $rootScope.MapLayers = response.layers;
                                $rootScope.StatisticalReportsLayers = response.layers.filter(function (item) {
                                    return item.isStatisticalReport;
                                });
                                $rootScope.$broadcast('layersDataLoaded', response);
                                callback(null);
                            });
                        },
                        function (callback) {
                            serviceData.getServicesList(function () {
                                callback(null);
                            });
                        }
                    ],
                    function (err, result) {
                        callback();
                    });
            };

            service.zoomToLayer = function(code, layerId){
                var strWhere = "";
                switch(layerId){
                    case 8:
                        strWhere =  "GOVCODE = {GovCodeVal}".format({GovCodeVal: code});
                        break;
                    case 7:
                        strWhere = "DISTCODE = {DistCodeVal}".format({DistCodeVal: code});
                        break;
                    case 6:
                        strWhere = "SUBDISTCODE = {SubDistCodeVal}".format({SubDistCodeVal: code});
                        break;
                    case 5:
                        strWhere = "LOCCODE = {LocCodeVal}".format({LocCodeVal: code});
                        break;
                    case 4:
                        strWhere = "AREACODE = {AreaCodeVal}".format({AreaCodeVal: code});
                        break;
                    case 3:
                        strWhere = "NHCODE = {NHCodeVal}".format({NHCodeVal: code});
                        break;

                }
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(layerId),
                    outFields: ['*'],
                    strWhere: strWhere,
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    if (featureSet.features.length > 0) {
                        var layerInfo = featureSet.features[0];
                        var _symbol;

                        $rootScope.map.graphics.clear();

                        if (layerInfo.geometry) {
                            switch (layerInfo.geometry.type) {
                                case "point":
                                    _symbol = esriLib.GetPictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png", "image/png", 24, 24);
                                    break;
                                case "polygon":
                                    _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID", [255, 0, 0], 3, [255, 255, 255, 0.1]);
                                    break;
                                case "polyline":
                                    _symbol = esriLib.GetSimpleLineSymbol("STYLE_SOLID", [220, 217, 217, 0.5], 3);
                                    break;
                            }
                            //var _point = esriLib.CreatePoint(result[0].x, result[0].y, result[0].spatialReference);
                            var graphic = esriLib.CreateGraphic(layerInfo.geometry, _symbol, layerInfo.attributes, null);

                            $rootScope.map.graphics.add(graphic);
                            var center = layerInfo.geometry.getExtent().getCenter();

                            switch (layerInfo.geometry.type) {
                                case "point":
                                    $rootScope.map.centerAndZoom(layerInfo.geometry, 18);
                                    //$scope.map.infoWindow.setContent("${{LayerName}} <br />");
                                    //$scope.map.infoWindow.show(center);
                                    break;
                                case "polygon":
                                    $rootScope.map.setExtent(layerInfo.geometry.getExtent(), true);
                                    /*$scope.map.infoWindow.setTitle("sdflsdf");
                                     $scope.map.infoWindow.setContent("Testing the test <br />".format({LayerName: $rootScope.LayerAttributeName}));
                                     $scope.map.infoWindow.show(center);
                                     */
                                    break;
                                case "polyline":
                                    $rootScope.map.setExtent(layerInfo.geometry.getExtent(), true);
                                    //$scope.map.infoWindow.show(center);
                                    break;
                            }
                        }
                    }

                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            service.drawLayerGraphic = function (layerInfo, layerId) {
                $rootScope.map.infoWindow.hide();
                var infoObj = {};
                infoObj.layerId = layerId;
                switch (layerId) {
                    case 8:
                        infoObj.code = layerInfo.attributes.GOVCODE;
                        break;
                    case 7:
                        infoObj.code = layerInfo.attributes.DISTCODE;
                        break;
                    case 6:
                        infoObj.code = layerInfo.attributes.SUBDISTCODE;
                        break;
                    case 5:
                        infoObj.code = layerInfo.attributes.LOCCODE;
                        break;
                    case 4:
                        infoObj.code = layerInfo.attributes.AREACODE;
                        break;
                    case 3:
                        infoObj.code = layerInfo.attributes.NHCODE;
                        break;
                }

                async.waterfall([
                        function (callback) {
                            serviceData.GetLayerGeneralInfo(infoObj, function (response) {
                                callback(null, response);
                            });
                        }
                    ],
                    function (err, layerObj) {
                        var templateContent = '*';
                        if (layerObj.length > 0) {
                            templateContent = "<ul class='list-group' style='direction: {direction};text-align: {text_align}'>".format({direction: $rootScope.lang == 'ar' ? 'rtl' : 'ltr', text_align: $rootScope.lang == 'ar' ? 'right' : 'left'});
                            templateContent = templateContent.concat("<li class='list-group-item'>{BuildingCntText}:{TOT}</li>".format({
                                BuildingCntText: $rootScope.getField('BuildingCntText'),
                                TOT: layerObj[0].BUILD_TOT
                            }));
                            templateContent = templateContent.concat("<li class='list-group-item'>{PopulationCtnText}:{TOT}</li>".format({
                                PopulationCtnText: $rootScope.getField('PopulationCtnText'),
                                TOT: layerObj[0].POP_TOT
                            }));
                            templateContent = templateContent.concat("<li class='list-group-item'>{HousingCntText}:{TOT}</li>".format({
                                HousingCntText: $rootScope.getField('HousingCntText'),
                                TOT: layerObj[0].HOUSE_TOT
                            }));
                            templateContent = templateContent.concat("<li class='list-group-item'>{FamilyCntText}:{TOT}</li>".format({
                                FamilyCntText: $rootScope.getField('POP_MALE_TOT'),
                                TOT: layerObj[0].POP_MALE_TOT
                            }));
                            templateContent = templateContent.concat("<li class='list-group-item'>{POP_FEMALE_TOT}:{TOT}</li>".format({
                                POP_FEMALE_TOT: $rootScope.getField('POP_FEMALE_TOT'),
                                TOT: layerObj[0].POP_FEMALE_TOT
                            }));
                            /*templateContent = templateContent.concat("<li class='list-group-item'>{JordanPopulationText}:{JO_CNT}</li>".format({
                                JordanPopulationText: $rootScope.getField('JordanPopulationText'),
                                JO_CNT: layerObj[0].JO_CNT
                            }));
                            templateContent = templateContent.concat("<li class='list-group-item'>{NonJordanianPopulationText}:{OTH_CNT}</li>".format({
                                NonJordanianPopulationText: $rootScope.getField('PopulationCtnText'),
                                OTH_CNT: layerObj[0].OTH_CNT
                            }));*/
                            templateContent = templateContent.concat("</ul>");
                        }
                        var _infoTemplate = esriLib.GetInfoTemplate("${{LayerName}} <br />".format({LayerName: $rootScope.getField('LayerAttributeName')}), templateContent);
                        var _symbol;

                        $rootScope.map.graphics.clear();

                        if (layerInfo.geometry) {
                            switch (layerInfo.geometry.type) {
                                case "point":
                                    _symbol = esriLib.GetPictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png", "image/png", 24, 24);
                                    break;
                                case "polygon":
                                    _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID", [255, 0, 0], 3, [255, 255, 255, 0.1]);
                                    break;
                                case "polyline":
                                    _symbol = esriLib.GetSimpleLineSymbol("STYLE_SOLID", [220, 217, 217, 0.5], 3);
                                    break;
                            }
                            //var _point = esriLib.CreatePoint(result[0].x, result[0].y, result[0].spatialReference);
                            var graphic = esriLib.CreateGraphic(layerInfo.geometry, _symbol, layerInfo.attributes, _infoTemplate);

                            $rootScope.map.graphics.add(graphic);
                            var center = layerInfo.geometry.getExtent().getCenter();

                            switch (layerInfo.geometry.type) {
                                case "point":
                                    $rootScope.map.centerAndZoom(layerInfo.geometry, 18);
                                    //$scope.map.infoWindow.setContent("${{LayerName}} <br />");
                                    //$scope.map.infoWindow.show(center);
                                    break;
                                case "polygon":
                                    $rootScope.map.setExtent(layerInfo.geometry.getExtent(), true);
                                    /*$scope.map.infoWindow.setTitle("sdflsdf");
                                     $scope.map.infoWindow.setContent("Testing the test <br />".format({LayerName: $rootScope.LayerAttributeName}));
                                     $scope.map.infoWindow.show(center);
                                     */
                                    break;
                                case "polyline":
                                    $rootScope.map.setExtent(layerInfo.geometry.getExtent(), true);
                                    //$scope.map.infoWindow.show(center);
                                    break;
                            }
                        }
                    });

            };

            service.GetServicesMapIcons = function (code) {
                return "img/icons/service_{code}.svg".format({code: code});
            };

            service.GetLayerObjInfo = function (layerName) {
                return ($rootScope.MapLayers.filter(function (item) {
                    return (item.strId == layerName);
                }))[0];
            };

            service.GetLayerInfoById = function (id) {
                return ($rootScope.MapLayers.filter(function (item) {
                    return (item.id == id);
                }))[0];
            };

            return service;
        }]);
