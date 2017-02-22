'use strict';

angular.module('gisapp')
    .directive('sideMenu', function ($rootScope) {
        var sideMenuCtrl = function ($rootScope, $scope, $timeout, $translate, generalservice, serviceBase, statisticalservice, esriLib) {
            // MetsiMenu

            $scope.SelectedNearestServiceType = generalservice.SelectedNearestServiceType;
            $scope.bufferDistance = generalservice.bufferDistance;
            $scope.isSearchNearestServiceEnabled = generalservice.isSearchNearestServiceEnabled;

            var selectedLayerColor;
            var colorPicker;

            $rootScope.$on('libLoaded', function (event, data) {
                if (data) {
                    colorPicker = esriLib.createColorPicker("dvColorPicker", "#ce641d");

                    colorPicker.on("color-change", function () {
                        var colorCode = this.color;
                        if (selectedLayerColor) {
                            selectedLayerColor.renderer.symbol.outline.color = esriLib.generateColor(colorCode);
                            selectedLayerColor.refresh();
                            //var slr = esriLib.CreateFillRenderer("STYLE_SOLID", [102, 140, 255, 0.9], 3, "STYLE_SOLID", [68, 68, 68, 0]);
                            //selectedLayerColor.setRenderer(slr);
                        }
                    });
                }
            });

            $scope.selectColorLayer = function (id) {
                var layer = _.findWhere($rootScope.MapLayers, {id: id});
                $scope.selectedBaseColorLayer = layer[$rootScope.LayersDisplayName];
                selectedLayerColor = $scope.map._layers[layer.strId];
            };

            $scope.$watch('SelectedNearestServiceType', function (item) {
                generalservice.SelectedNearestServiceType = item;
            });

            $scope.$watch('bufferDistance', function (item) {
                generalservice.bufferDistance = item;
            });

            $scope.$watch('isSearchNearestServiceEnabled', function (item) {
                generalservice.isSearchNearestServiceEnabled = item;
            });

            $scope.GetAttributeName = function () {
                return $scope.AttributeName;
            };

            $rootScope.$on('baseLayersChanged', function (event, data) {
                $scope.baseLayers = data;
            });

            $scope.servicesList = [];
            $rootScope.$on('serviceListChanged', function (event, data) {
                $scope.ServicesList = data;
            });

            $rootScope.$on('GovernoratesSearch', function (event, data) {
                $scope.GovernoratesSearch = data;
            });

            $rootScope.$on('layersForServices', function (event, data) {
                $scope.layersForServices = data;
            });

            /*$scope.GetLayerObjInfo = function (layerName) {
             return ($rootScope.MapLayers.filter(function (item) {
             return (item.strId == layerName);
             }))[0];
             };*/

            $scope.GetLayerAttributeName = function () {
                return $rootScope.LayerAttributeName;
            };

            $scope.GetServicesSmallImages = function (item) {
                var src = "img/icons/service_{code}.svg".format({code: item.CODE});
                return src;
            };

            $scope.OnGovernorateChanged = function (_selectedGov) {
                $scope.SelectedDistrict = {};


                if (!_selectedGov || !_selectedGov.attributes.GOVCODE) {
                    _selectedGov.attributes.GOVCODE = "''";
                }
                //else
                $scope.SelectedGov = _selectedGov;
                generalservice.drawLayerGraphic($scope.SelectedGov, generalservice.GetLayerObjInfo("GovernorateFeatureLayer").id);

                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("SubGovernorateFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "GOVCODE = {GovCodeVal}".format({GovCodeVal: $scope.SelectedGov.attributes.GOVCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.DistrictsSearch = featureSet.features;
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnDistirctChanged = function (_districtCode) {
                $scope.SelectedSubDistrict = {};
                if (!_districtCode || !_districtCode.attributes.DISTCODE)
                    _districtCode.attributes.DISTCODE = "''";

                $scope.SelectedDistrict = _districtCode;
                generalservice.drawLayerGraphic($scope.SelectedDistrict, generalservice.GetLayerObjInfo("SubGovernorateFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("DistrictFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "DISTCODE = {DistCodeVal}".format({DistCodeVal: $scope.SelectedDistrict.attributes.DISTCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.SubDistrictsSearch = featureSet.features;
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnSubDistrictChanged = function (_subDistrictCode) {
                $scope.SelectedLocality = {};
                if (!_subDistrictCode || !_subDistrictCode.attributes.SUBDISTCODE)
                    _subDistrictCode.attributes.SUBDISTCODE = "''";
                $scope.SelectedSubDistrict = _subDistrictCode;

                generalservice.drawLayerGraphic($scope.SelectedSubDistrict, generalservice.GetLayerObjInfo("DistrictFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("LocalityFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "SUBDISTCODE = {SubDistCodeVal}".format({SubDistCodeVal: $scope.SelectedSubDistrict.attributes.SUBDISTCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.LocalitiesSearch = featureSet.features;
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnLocalityChanged = function (_localityCode) {
                $scope.SelectedArea = {};
                if (!_localityCode || !_localityCode.attributes.LOCCODE)
                    _localityCode.attributes.LOCCODE = "''";
                $scope.SelectedLocality = _localityCode;
                generalservice.drawLayerGraphic($scope.SelectedLocality, generalservice.GetLayerObjInfo("LocalityFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("RegionsFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "LOCCODE = {LocCodeVal}".format({LocCodeVal: $scope.SelectedLocality.attributes.LOCCODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.RegionsSearch = featureSet.features;
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnRegionChanged = function (_regionCode) {
                $scope.SelectedNH = {};
                if (!_regionCode || !_regionCode.attributes.AREACODE)
                    _regionCode.attributes.AREACODE = "''";

                $scope.SelectedArea = _regionCode;
                generalservice.drawLayerGraphic($scope.SelectedArea, generalservice.GetLayerObjInfo("RegionsFeatureLayer").id);
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("NeighborhoodsFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "AREACODE = {AreaCodeVal}".format({AreaCodeVal: $scope.SelectedArea.attributes.AREACODE}),
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $scope.NeighbourhoodsSearch = featureSet.features;
                }).then(function (result) {
                    result.cbFN(result.response);
                });
            };

            $scope.OnNeighbourhoodChanged = function (_neighbourhoodCode) {
                if (!_neighbourhoodCode || !_neighbourhoodCode.attributes.NHCODE)
                    _neighbourhoodCode.attributes.NHCODE = "''";
                $scope.SelectedNH = _neighbourhoodCode;
                generalservice.drawLayerGraphic($scope.SelectedNH, generalservice.GetLayerObjInfo("NeighborhoodsFeatureLayer").id);
            };


            $scope.invalid = {
                isAdvancedSearchServiceSelected: false,
                isGovernorateSelected: false,
                isNoServiceLayerSelected: false,
                isNoServiceSelected: false
            };

            $scope.SearchForServices = function () {
                var EstObj = {};

                if (!$scope.SelectedGov || $scope.SelectedGov.attributes.GOVCODE == "''")
                    $scope.invalid.isGovernorateSelected = true;
                else
                    $scope.invalid.isGovernorateSelected = false;

                if (!$scope.SelectedServiceId)
                    $scope.invalid.isAdvancedSearchServiceSelected = true;
                else
                    $scope.invalid.isAdvancedSearchServiceSelected = false;

                if ($scope.invalid.isGovernorateSelected || $scope.invalid.isAdvancedSearchServiceSelected) {

                    return;
                }

                EstObj.GovCode = $scope.SelectedGov.attributes.GOVCODE;
                try {
                    EstObj.DistCode = $scope.SelectedDistrict.attributes.DISTCODE;
                } catch (e) {
                    EstObj.DistCode = '';
                }

                try {
                    EstObj.SubDistCode = $scope.SelectedSubDistrict.attributes.SUBDISTCODE;
                } catch (e) {
                    EstObj.SubDistCode = '';
                }

                try {
                    EstObj.LocCode = $scope.SelectedLocality.attributes.LOCCODE;
                } catch (e) {
                    EstObj.LocCode = '';
                }

                try {
                    EstObj.AreaCode = $scope.SelectedArea.attributes.AREACODE;
                } catch (e) {
                    EstObj.AreaCode = '';
                }

                try {
                    EstObj.NHCode = $scope.SelectedNH.attributes.NHCODE;
                } catch (e) {
                    EstObj.NHCode = '';
                }

                EstObj.ActivityCode = $scope.SelectedServiceId;
                $scope.resetSearchPanelFlags();
                serviceBase.HttpRequest.Save({
                    url: '/establishments/GetEstablishments',
                    data: EstObj
                }, function (response) {
                    $scope.ServicesResult = [];
                    $.each(response.list, function (index, item) {
                        $scope.ServicesResult.push(item);
                        var point = esriLib.CreatePoint(item.GPS_Y, item.GPS_X, null);
                        var _symbol = esriLib.GetPictureMarkerSymbol(generalservice.GetServicesMapIcons(EstObj.ActivityCode), "image/png", 18, 18);
                        var serviceGraphic = esriLib.CreateGraphic(point, _symbol);
                        $rootScope.map.graphics.add(serviceGraphic);
                        $rootScope.map.graphics.on('mouse-over', function (evt) {
                            var dialog = esriLib.CreateTooltipDialog();
                            dialog.startup();
                            dialog.setContent(item.EST_NAME);
                            //domStyle.set(dialog.domNode, "opacity", 0.85);
                            /*dijit.popup.open({
                             popup: dialog,
                             x: evt.pageX,
                             y: evt.pageY
                             });*/
                        });
                    });
                    $scope.resetSearchPanelFlags();
                    if (response.list.length > 0) {
                        $scope.showSearchResultPanel = true;
                        $("#resultPanel").show("bounce");
                        $("#dvSearchResultPanel").show();
                    } else {
                        $("#resultPanel").hide("bounce");
                        serviceBase.showInfoNotification($scope.NoResultFound);
                    }
                });
            };

            $scope.SelectedNoServiceCode = "";

            $scope.SearchNoOfServices = function () {

                if (!$scope.SelectedNoServiceLayerId)
                    $scope.invalid.isNoServiceLayerSelected = true;
                else
                    $scope.invalid.isNoServiceLayerSelected = false;

                if(!$scope.SelectedNoServiceCode)
                    $scope.invalid.isNoServiceSelected = true;
                else
                    $scope.invalid.isNoServiceSelected = false;

                if($scope.invalid.isNoServiceSelected || $scope.isNoServiceLayerSelected)
                    return;

                var SearchObj = {};
                SearchObj.LayerId = $scope.SelectedNoServiceLayerId;
                SearchObj.ServiceId = $scope.SelectedNoServiceCode;
                SearchObj.fromNumber = $scope.fromNumber;
                SearchObj.toNumber = $scope.toNumber;
                $scope.ServicesResult = [];
                $scope.resetSearchPanelFlags();
                serviceBase.HttpRequest.Save({
                    url: '/establishments/GetServicesNoByLayer',
                    data: SearchObj
                }, function (response) {
                    if (response.list.length > 0) {
                        $scope.ServicesNoResult = response.list;
                        $scope.showNoServices = true;
                        $("#dvNoServices").show();
                        $("#resultPanel").show("bounce");

                    } else {
                        $("#resultPanel").hide("bounce");
                        serviceBase.showInfoNotification($scope.NoResultFound);
                    }
                });
            };


        };

        return {
            require: '^sideMenu',
            restrict: 'E',
            templateUrl: 'views/tpl/sidemenu.tpl.html',
            controller: sideMenuCtrl,
            layersForServices: function (scope, element, attrs) {

            }
        }
    })
    .directive('topMenu2', function () {
        var topMenuCtrl = function ($rootScope, $scope, $q, $translate, esriLib) {

            // Menu Toggle
            $('.menutoggle').click(function () {
                var body = $('body');
                var bodypos = body.css('position');

                if (bodypos != 'relative') {

                    if (!body.hasClass('leftpanel-collapsed')) {
                        body.addClass('leftpanel-collapsed');
                        $('.nav-bracket ul').attr('style', '');

                        $(this).addClass('menu-collapsed');
                        $('.rightpanelSection').removeClass('nav-justified');
                        $('.rightpanelSection').addClass('collapsed');
                        $('.rightpanelContent').css({display: 'none'});
                    } else {
                        body.removeClass('leftpanel-collapsed chat-view');
                        $('.rightpanelSection').addClass('nav-justified');
                        $('.rightpanelSection').removeClass('collapsed');
                        $('.nav-bracket li.active ul').css({display: 'block'});
                        $('.rightpanelContent').css({display: 'block'});

                        $(this).removeClass('menu-collapsed');

                    }
                } else {

                    if (body.hasClass('leftpanel-show'))
                        body.removeClass('leftpanel-show');
                    else
                        body.addClass('leftpanel-show');

                    adjustmainpanelheight();
                }


            });

            // Chat View
            $('#chatview').click(function () {

                var body = $('body');
                var bodypos = body.css('position');

                if (bodypos != 'relative') {

                    if (!body.hasClass('chat-view')) {
                        body.addClass('leftpanel-collapsed chat-view');
                        $('.nav-bracket ul').attr('style', '');

                    } else {

                        body.removeClass('chat-view');

                        if (!$('.menutoggle').hasClass('menu-collapsed')) {
                            $('body').removeClass('leftpanel-collapsed');
                            $('.nav-bracket li.active ul').css({display: 'block'});
                        } else {

                        }
                    }

                } else {

                    if (!body.hasClass('chat-relative-view')) {

                        body.addClass('chat-relative-view');
                        body.css({left: ''});

                    } else {
                        body.removeClass('chat-relative-view');
                    }
                }

            });

            $scope.hideLeftSideMenu = function () {
                $("body").toggleClass("mini-navbar");
                SmoothlyMenu();
            };

            // Open close right sidebar
            $('.right-sidebar-toggle').click(function () {
                $('#right-sidebar').toggleClass('sidebar-open');
            });


        };

        return {
            require: '^topMenu',
            restrict: 'E',
            templateUrl: 'views/tpl/topmenu.tpl.html',
            controller: topMenuCtrl
        }
    })
    .directive('dropdownNormal', function ($rootScope) {
        var ctrl = function ($rootScope, $scope) {

        }

        return {
            restrict: 'E',
            templateUrl: 'views/tpl/dropdown.tpl.html',
            replace: true,
            scope: {
                selectedValue: '=',
                defaultValue: '@',
                ddlText: '=',
                list: '=',
                hasIcon: '=',
                property: '@',
                propertyExtension: '@',
                ddlvalue: '@',
                placeholder: '@',
                getImageurl: '&',
                customSelection: '=',
                ddlChange: '&'
            },
            link: function (scope, element, attrs) {

                scope.isPlaceHolder = true;
                scope.listVisible = false;
                scope.selectedItem = {};

                scope.select = function (item) {
                    scope.isPlaceHolder = false;
                    scope.selectedItem = item;
                    if (scope.ddlvalue !== undefined)
                        scope.selectedValue = Object.byString(item, scope.ddlvalue);
                    else {
                        scope.selectedValue = item;
                    }

                    try {
                        if (isFunction(scope.ddlChange))
                            scope.ddlChange()(scope.selectedValue);
                    } catch (ex) {
                        console.log(ex);
                    }

                };

                scope.$watch('list', function (item) {
                    if (item && scope.defaultValue) {
                        var obj = {};
                        obj = Object.stringGenerator(scope.property, scope.defaultValue);
                        scope.list.splice(0, 0, obj);
                    }
                });

                scope.getTextValue = function (item) {
                    return Object.byString(item, scope.property);
                };

                scope.GetImageUrl = function (item) {
                    try {
                        if (scope.hasIcon)
                            return scope.getImageurl()(item);
                        else {
                            return '';
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                }

                scope.showIcon = function () {
                    return scope.hasIcon;
                }

                scope.isSelected = function (item) {
                    /*if (scope.propertyExtension)
                     if (!scope.selectedItem[scope.property])
                     return false;
                     else
                     return item[scope.property][scope.propertyExtension] == scope.selectedItem[scope.property][scope.propertyExtension];
                     else
                     return item[scope.property] == scope.selectedItem[scope.property];
                     */
                    if (!Object.byString(scope.selectedItem, scope.property))
                        return false;
                    return Object.byString(item, scope.property) === Object.byString(scope.selectedItem, scope.property);
                }

                $rootScope.$on("documentClicked", function (inner, target) {
                    console.log($(target[0]).is("."))
                });

                scope.$watch("selectedItem", function (value) {
                    try {
                        scope.isPlaceHolder = Object.byString(scope.selectedItem, scope.property) === undefined;
                        scope.display = Object.byString(scope.selectedItem, scope.property);
                        /*if (scope.propertyExtension) {
                         scope.isPlaceHolder = scope.selectedItem[scope.property][scope.propertyExtension] === undefined;
                         scope.display = scope.selectedItem[scope.property][scope.propertyExtension];
                         }
                         else {
                         scope.isPlaceHolder = scope.selectedItem[scope.property] === undefined;
                         scope.display = scope.selectedItem[scope.property];
                         }*/
                    } catch (ex) {
                        //console.log(ex);
                    }
                });
            }
        }
    })
    .directive('dropdownLayer', function ($rootScope) {
        var ctrl = function ($rootScope, $scope) {

        }

        return {
            restrict: 'E',
            templateUrl: 'views/tpl/dropdownlayer.tpl.html',
            replace: true,
            scope: {
                selectedValue: '=',
                ddlText: '=',
                list: '=',
                hasIcon: '=',
                property: '@',
                ddlvalue: '@',
                placeholder: '@',
                getImageurl: '&',
                ddlChange: '&'
            },
            link: function (scope, element, attrs) {

                scope.isPlaceHolder = true;
                scope.listVisible = false;
                scope.selectedItem = {};

                scope.select = function (item) {
                    scope.isPlaceHolder = false;
                    scope.selectedItem = item;
                    if (scope.ddlvalue !== undefined)
                        scope.selectedValue = item[scope.ddlvalue];
                    else {
                        scope.selectedValue = item;
                    }

                    if (isFunction(scope.ddlChange))
                        scope.ddlChange()(item);
                }

                scope.GetImageUrl = function (item) {
                    try {
                        if (scope.hasIcon)
                            return scope.getImageurl()(item);
                        else {
                            return '';
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                }

                scope.showIcon = function () {
                    return scope.hasIcon;
                }

                scope.isSelected = function (item) {
                    try {
                        return item.attributes[scope.property] == scope.selectedItem.attributes[scope.property];
                    } catch (ex) {

                    }
                    return false;
                }

                $rootScope.$on("documentClicked", function (inner, target) {
                    console.log($(target[0]).is("."))
                });

                scope.$watch("selectedItem", function (value) {
                    try {
                        scope.isPlaceHolder = scope.selectedItem[scope.property] === undefined;
                        scope.display = scope.selectedItem.attributes[scope.property];
                    } catch (ex) {

                    }
                });
            }
        }
    })
    .directive('checkboxSwitch', function () {
        var ctrl = function ($rootScope, $scope) {
            // bootstrap-switch
            $(".switch").bootstrapSwitch();
        }

        return {
            restrict: 'E',
            template: '<input type="checkbox"  ng-click="method()" class="switch" data-size="mini" />',
            scope: {
                ngModel: '=',
                method: '&'
            },

            link: function (scope, element, attrs) {

            }
        }
    })
    .directive('searchLayers', function () {
        var searchLayersCtrl = function ($rootScope, $scope, $q, $translate, serviceBase, esriLib) {

            $scope.GetLayerAttributeName = function () {
                return $scope.LayerAttributeName;
            };

            $scope.SearchLayersDropDown = function (val) {
                if ($scope.selectedSearchLayerId == undefined) {
                    serviceBase.showInfoNotification($scope.SelectLayerWarning);
                    return [];
                }
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl($scope.selectedSearchLayerId),
                    outFields: ["*"],
                    strWhere: "{LayerAttrName} like '%{SearchVal}%'".format({
                        SearchVal: val,
                        LayerAttrName: $rootScope.LayerAttributeName
                    }),
                    returnGeometry: true
                }

                return esriLib.InvokeQueryTask(QueryTaskOpts, false, function (featureSet) {
                    var _featureResult = featureSet.features;
                    // returning search dropdown
                    return _featureResult;
                })
                    .then(function (result) {
                        return result.cbFN(result.response);
                    });
            }

            $scope.ZoomToSelected = function ($item, $model, $label, $event) {
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
                var graphic = esriLib.CreateGraphic($item.geometry, _symbol, $scope.selectedSearch.attributes, _infoTemplate);
                $rootScope.map.graphics.clear();
                $rootScope.map.graphics.add(graphic);
                switch ($item.geometry.type) {
                    case "point":
                        $rootScope.map.centerAndZoom($item.geometry, 18);
                        break;
                    case "polygon":
                        $rootScope.map.setExtent($item.geometry.getExtent(), true);
                        break;
                    case "polyline":
                        $rootScope.map.setExtent($item.geometry.getExtent(), true);
                        break;
                }
            };

            $scope.invalid = {
                isNotEmptySearchText: false,
                isDropdownNotSelected: false
            };


            $scope.SearchLayers = function () {


                if (!$scope.selectedSearch) {
                    $scope.invalid.isNotEmptySearchText = true;
                } else
                    $scope.invalid.isNotEmptySearchText = false;

                if (!$scope.selectedSearchLayerId)
                    $scope.invalid.isDropdownNotSelected = true;
                else
                    $scope.invalid.isDropdownNotSelected = false;

                if ($scope.invalid.isDropdownNotSelected || $scope.invalid.isNotEmptySearchText)
                    return;

                var searchVal = '';
                if ($scope.selectedSearch.attributes) {
                    searchVal = $scope.selectedSearch.attributes[$scope.LayerAttributeName];
                } else {
                    searchVal = $scope.selectedSearch;
                }
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl($scope.selectedSearchLayerId),
                    outFields: ["*"],
                    strWhere: "{LayerAttrName} like '%{SearchVal}%'".format({
                        SearchVal: searchVal,
                        LayerAttrName: $scope.LayerAttributeName
                    }),
                    returnGeometry: true
                }

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    $rootScope.map.graphics.clear();
                    var _featureResult = featureSet.features;
                    if (_featureResult.length > 0) {
                        var graphicsExtent = esriLib.GetGraphicsExtent(_featureResult);
                        $rootScope.map.setExtent(graphicsExtent, true);
                        $.each(_featureResult, function (index, val) {
                            var _infoTemplate = esriLib.GetInfoTemplate("${{LayerName}}".format({LayerName: $scope.LayerAttributeName}), "${*}");
                            var _symbol;
                            switch (val.geometry.type) {
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
                            var graphic = val;
                            graphic.setSymbol(_symbol);
                            graphic.setInfoTemplate(_infoTemplate);
                            $rootScope.map.graphics.add(graphic);
                        });
                    } else {
                        serviceBase.showWarningNotification($rootScope.NoResultFound);
                    }

                }).then(function (result) {
                    return result.cbFN(result.response);
                });

            };

        }; // end of controller

        return {
            require: '^searchLayers',
            restrict: 'E',
            templateUrl: 'views/tpl/searchlayertext.tpl.html',
            controller: searchLayersCtrl
        }
    })
    .directive('requiredText', function () {
        return {
            restrict: 'EA',
            templateUrl: 'views/tpl/requiredTextbox.tpl.html'
        }
    })
    .directive('requiredDropdown', function () {
        return {
            restrict: 'EA',
            templateUrl: 'views/tpl/requiredDropdown.tpl.html'
        }
    });
