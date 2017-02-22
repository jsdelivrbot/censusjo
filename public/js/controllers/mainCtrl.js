'use strict';

angular.module('gisapp')
    .controller('mainCtrl', ['$rootScope', '$scope', '$cookies', '$translate', '$timeout', 'blockUI', 'generalservice', 'serviceBase', 'esriLib',
        function ($rootScope, $scope, $cookies, $translate, $timetout, blockUI, generalservice, serviceBase, esriLib) {
            $rootScope.map;
            $scope.veTileLayer;
            $rootScope.map = {};
            $rootScope.MapLayers = [];
            $scope.SubGovernorateFeatureLayer = {};
            $scope.DistrictFeatureLayer = {};
            $scope.LocalityFeatureLayer = {};
            $scope.RegionsFeatureLayer = {};
            $scope.NeighborhoodsFeatureLayer = {};
            $scope.BlocksFeatureLayer = {};
            $scope.RoadsFeatureLayer = {};
            $scope.BuildingsFeatureLayer = {};
            $scope.LandmarksFeatureLayer = {};
            $rootScope.JordanExtent = {};

            // initialization variables
            $scope.fromNumber = 1;
            $scope.toNumber = 5;

            $scope.layersPopover = {
                templateUrl: 'layersTemplate.html',
            };

            $scope.printPopover = {
                printTemplate: 'printTemplate.html'
            };

            //var blocker = blockUI.instances.get('blocker');

            $scope.GoHome = function () {
                $rootScope.map.setExtent($rootScope.JordanExtent);
            };

            $rootScope.$on('resetAll', function(event, data){
              $scope.GoHome();
            });

            $scope.baseMapIndex = 1;
            $scope.SetBaseMaps = function (baseNo) {
                $scope.baseMapIndex = baseNo;
                switch (baseNo) {
                    case 1:
                        $scope.veTileLayer.setMapStyle(esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL);
                        break;
                    case 2:
                        $scope.veTileLayer.setMapStyle(esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS);
                        break;
                    case 3:
                        $scope.veTileLayer.setMapStyle(esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD);
                        break;
                }
            };

            $scope.isBaseMapIndex = function(baseNo){
                return $scope.baseMapIndex === baseNo;
            }

            $scope.GetLayerDisplayName = function () {
                return $rootScope.LayersDisplayName;
            };

            $scope.showMeasurement = function(){
                $('.measureTools').toggle();
            };

            $scope.GetGovernorates = function () {
                var QueryTaskOpts = {
                    url: GenerateMapServerUrl(generalservice.GetLayerObjInfo("GovernorateFeatureLayer").id),
                    outFields: ['*'],
                    strWhere: "1 = 1",
                    orderByFields: ["GOVCODE ASC"],
                    returnGeometry: true
                };

                esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                    featureSet.features = _.sortBy(featureSet.features, function(item){
                       return item.attributes.GOVCODE;
                    });
                    $rootScope.$broadcast('GovernoratesSearch', featureSet.features);
                    $scope.GovernoratesSearch = featureSet.features;
                }).then(function (result) {
                    return result.cbFN(result.response);
                });
            };

            $scope.SelectedLayers = [];
            $scope.loadLayers = function () {
                blockUI.start();

                generalservice.loadInitializationData(function () {
                    $scope.LayersShowHide = $rootScope.MapLayers.filter(function (item) {
                        return item.showHide === true;
                    });

                    var layersForServices = $rootScope.MapLayers.filter(function (item) {
                        return item.id != generalservice.GetLayerObjInfo("EstTable").id
                            && item.isAdvancedSearch == true;
                    });

                    $rootScope.$broadcast('layersForServices', layersForServices);

                    var baseLayers = $rootScope.MapLayers.filter(function (item) {
                        return item.id != generalservice.GetLayerObjInfo("EstTable").id;
                    });

                    $rootScope.$broadcast('baseLayersChanged', baseLayers);

                    try {
                        $scope.GetGovernorates();
                        $scope.AddLayers();
                    } catch (e) {
                        serviceBase.showErrorNotification(e.message);
                    } finally {
                        blockUI.stop();
                    }

                });
                /*serviceBase.HttpRequest.Query({url:'/layers/layers.json', data: {}}, function(response){
                 $rootScope.MapLayers = response;

                 });*/
            };


            $scope.AddLayers = function () {
                $scope.CreateGovernorateFeatureLayer();
                $scope.CreateSubGovernorateFeatureLayer();
                $scope.CreateDistrictFeatureLayer();
                $scope.CreateLocalityFeatureLayer();
                $scope.CreateRegionFeatureLayer();
                $scope.CreateNeighbourhoodFeatureLayer();
                //$scope.CreateBlocksFeatureLayer();
                //$scope.CreateRoadsFeatureLayer();
                //$scope.CreateBuildingsFeatureLayer();
                //$scope.CreateLandMarksFeatureLayer();
            };

            $scope.CreateGovernorateFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("GovernorateFeatureLayer");
                $scope.GovernorateFeatureLayer = esriLib.CreateFeatureLayerInstance('GovernorateFeatureLayer', layerObj.id, [$rootScope.getField('LayerAttributeName')]);

                var GovernorateRender = esriLib.CreateFillRenderer("STYLE_SOLID", [0, 0, 255, 1], 3, "STYLE_SOLID", [157, 151, 129, .3]);

                $scope.GovernorateFeatureLayer.setRenderer(GovernorateRender);
              //  $scope.GovernorateFeatureLayer.setMaxScale(577790.554289);
              //  $scope.GovernorateFeatureLayer.setMinScale(36111.909643);

                $rootScope.map.addLayer($scope.GovernorateFeatureLayer);

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('NORMAL'), "GovernorateLabelLayer");

                var labelName = "{" + $rootScope.getField('LayerAttributeName') + "}";
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.GovernorateFeatureLayer, LabelLayerObj.labelRenderer, labelName);

                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);


                $scope.GovernorateFeatureLayer.on("mouse-over", function (evt) {
                    var highlightSymbol = esriLib.GetSimpleFillSymbol('STYLE_SOLID', 'STYLE_SOLID', [255, 0, 0], 3, [125, 125, 125, 0.35]);
                    var highlightGraphic = esriLib.CreateGraphic(evt.graphic.geometry, highlightSymbol);
                    //$rootScope.map.graphics.add(highlightGraphic);
                });
            };

            $scope.CreateSubGovernorateFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("SubGovernorateFeatureLayer");
                $scope.SubGovernorateFeatureLayer = esriLib.CreateFeatureLayerInstance("SubGovernorateFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);
                var SubGovernorateRender = esriLib.CreateFillRenderer("STYLE_SOLID", [128, 0, 63, 0.8], 3, "STYLE_SOLID", [255, 0, 255, 0.05]);

                $scope.SubGovernorateFeatureLayer.setRenderer(SubGovernorateRender);
                $scope.SubGovernorateFeatureLayer.setMinScale(2311162.217155);
                $scope.SubGovernorateFeatureLayer.setMaxScale(577790.554289);
                //$scope.SubGovernorateFeatureLayer.setMaxScale(1155581);
                $rootScope.map.addLayer($scope.SubGovernorateFeatureLayer);
                $scope.SubGovernorateFeatureLayer.visible = true;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "SubGovernorateLabelLayer");

                LabelLayerObj.LabelLayer.addFeatureLayer($scope.SubGovernorateFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateDistrictFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("DistrictFeatureLayer");
                $scope.DistrictFeatureLayer = esriLib.CreateFeatureLayerInstance("DistrictFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);

                var DistrictRenderer = esriLib.CreateFillRenderer("STYLE_SOLID", [163, 163, 204, 0.7], 3, "STYLE_SOLID", [255, 0, 255, 0.05]);

                $scope.DistrictFeatureLayer.setRenderer(DistrictRenderer);
                $scope.DistrictFeatureLayer.setMinScale(577790.554289);
                $scope.DistrictFeatureLayer.setMaxScale(577790.554289);
                $rootScope.map.addLayer($scope.DistrictFeatureLayer);
                $scope.DistrictFeatureLayer.visible = false;

                var LabelLayerObj = esriLib.CreateLabelLayer(new esri.Color([255, 255, 255, 255]), "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "DistrictLabelLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.DistrictFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateLocalityFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("LocalityFeatureLayer");
                $scope.LocalityFeatureLayer = esriLib.CreateFeatureLayerInstance("LocalityFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);
                var LocalityRenderer = esriLib.CreateFillRenderer("STYLE_SOLID", [0, 128, 43, 0.7], 3, "STYLE_SOLID", [230, 160, 100, 0.25]);

                $scope.LocalityFeatureLayer.setRenderer(LocalityRenderer);
                $scope.LocalityFeatureLayer.setMinScale(288895.277144);
                $scope.LocalityFeatureLayer.setMaxScale(144447.638572);
                //$scope.LocalityFeatureLayer.setMaxScale(18055.954822);
                $rootScope.map.addLayer($scope.LocalityFeatureLayer);
                $scope.LocalityFeatureLayer.visible = true;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "LocalityLabelLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.LocalityFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateRegionFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("RegionsFeatureLayer");
                $scope.RegionsFeatureLayer = esriLib.CreateFeatureLayerInstance("RegionsFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);
                var RegionRenderer = esriLib.CreateFillRenderer("STYLE_SOLID", [204, 102, 153, 0.8], 3, "STYLE_SOLID", [150, 130, 50, 0.1]);

                $scope.RegionsFeatureLayer.setRenderer(RegionRenderer);
                $scope.RegionsFeatureLayer.setMinScale(144447.638572);
                $scope.RegionsFeatureLayer.setMaxScale(36111.909643);
                $rootScope.map.addLayer($scope.RegionsFeatureLayer);
                $scope.RegionsFeatureLayer.visible = true;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "RegionsLabelLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.RegionsFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateNeighbourhoodFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("NeighborhoodsFeatureLayer");
                $scope.NeighborhoodsFeatureLayer = esriLib.CreateFeatureLayerInstance("NeighborhoodsFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);

                var NeighbourhoodRenderer = esriLib.CreateFillRenderer("STYLE_SOLID", [102, 140, 255, 0.9], 3, "STYLE_SOLID", [68, 68, 68, 0]);

                $scope.NeighborhoodsFeatureLayer.setRenderer(NeighbourhoodRenderer);
                $scope.NeighborhoodsFeatureLayer.setMinScale(36111.909643);
                $rootScope.map.addLayer($scope.NeighborhoodsFeatureLayer);
                $scope.NeighborhoodsFeatureLayer.visible = true;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "NeighbourhoodLabelLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.NeighborhoodsFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateBlocksFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("BlocksFeatureLayer");
                $scope.BlocksFeatureLayer = esriLib.CreateFeatureLayerInstance("BlocksFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);
                var BlocksRenderer = esriLib.CreateFillRenderer("STYLE_SOLID", "#AAff66", 3, "STYLE_SOLID", [140, 0, 230, 0.25]);

                $scope.BlocksFeatureLayer.setRenderer(BlocksRenderer);
                $rootScope.map.addLayer($scope.BlocksFeatureLayer);
                $scope.BlocksFeatureLayer.visible = false;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "BlocksLabelLayer");

                LabelLayerObj.LabelLayer.addFeatureLayer($scope.BlocksFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateRoadsFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("RoadsFeatureLayer");
                $scope.RoadsFeatureLayer = esriLib.CreateFeatureLayerInstance("RoadsFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);

                var RoadsRenderer = esriLib.CreateSimpleLineRenderer("STYLE_SOLID", [255, 217, 102, 0.5], 3);

                $scope.RoadsFeatureLayer.setRenderer(RoadsRenderer);
                $scope.RoadsFeatureLayer.setMinScale(577790.554289);
                $rootScope.map.addLayer($scope.RoadsFeatureLayer);
                $scope.RoadsFeatureLayer.visible = false;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "RoadsLabelsLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.RoadsFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateBuildingsFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("BuildingsFeatureLayer");
                $scope.BuildingsFeatureLayer = esriLib.CreateFeatureLayerInstance("BuildingsFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);

                var BuildingsRenderer = esriLib.CreatePictureSymbolRenderer("http://static.arcgis.com/images/Symbols/PeoplePlaces/esriBusinessMarker_62_Blue.png",
                    "image/png", 24, 24);
                $scope.BuildingsFeatureLayer.setRenderer(BuildingsRenderer);
                $scope.BuildingsFeatureLayer.setMinScale(2311162.217155);
                $rootScope.map.addLayer($scope.BuildingsFeatureLayer);
                $scope.BuildingsFeatureLayer.visible = false;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "BuildingsLabelLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.BuildingsFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            };

            $scope.CreateLandMarksFeatureLayer = function () {
                var layerObj = generalservice.GetLayerObjInfo("LandmarksFeatureLayer");
                $scope.LandmarksFeatureLayer = esriLib.CreateFeatureLayerInstance("LandmarksFeatureLayer", layerObj.id, [$rootScope.getField('LayerAttributeName')]);

                var LandMarksRenderer = esriLib.CreatePictureSymbolRenderer("http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png",
                    "image/png", 24, 24);
                $scope.LandmarksFeatureLayer.setRenderer(LandMarksRenderer);
                $scope.LandmarksFeatureLayer.setMinScale(2311162.217155);
                $rootScope.map.addLayer($scope.LandmarksFeatureLayer);
                $scope.LandmarksFeatureLayer.visible = false;

                var LabelLayerObj = esriLib.CreateLabelLayer([255, 255, 255, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'), "LandMarkLabelLayer");
                LabelLayerObj.LabelLayer.addFeatureLayer($scope.LandmarksFeatureLayer, LabelLayerObj.labelRenderer, "{" + $rootScope.getField('LayerAttributeName') + "}");
                $rootScope.map.addLayer(LabelLayerObj.LabelLayer);
            }

            $scope.Testing = function () {
                serviceBase.HttpRequest.Query({
                    url: '/establishments/GetEstablishments',
                    data: {}
                }, function (response) {
                    console.log(response);
                });
            };

            $rootScope.ShowLayer = function ($event, layerStrId) {
                var chk = $event.target;
                if (chk.checked)
                    $scope[layerStrId].setVisibility(true);
                else {
                    $scope[layerStrId].setVisibility(false);
                }
            };

            $("#resultPanel").toggle();

            $scope.showLayerSideBar = function () {
                $('.sidelayers-box').toggleClass("show");
                $('.side-search-box').removeClass('show');
            };

            $scope.showSearchSide = function () {
                $(".side-search-box").toggleClass("show");
                $('.sidelayers-box').removeClass('show');
            }

            $rootScope.$on('libLoaded', function(evt, data){
            require([
                    "esri/map",
                    "esri/toolbars/navigation",
                    "dojo/on",
                    "dojo/parser",
                    "dijit/registry",
                    "dijit/Toolbar",
                    "dijit/form/Button",
                    "esri/dijit/Scalebar",
                    "esri/graphic",
                    "esri/virtualearth/VETiledLayer",
                    "esri/Color",
                    "esri/tasks/query",
                    "esri/layers/FeatureLayer",
                    "dijit/popup",
                    "dojo/dom-style",
                    "esri/dijit/HomeButton",
                    "dojox/widget/ColorPicker",
                    "esri/arcgis/utils",
                    "esri/dijit/Print",
                    "esri/tasks/PrintTemplate",
                    "dojo/dom",
                    "dojo/_base/array",
                    "esri/dijit/OverviewMap"],
                function (Map, Navigation, on, parser, registry, Toolbar, Button, Scalebar, Graphic, VETiledLayer, Color, Query, FeatureLayer, dijitPopup, domStyle, HomeButton, ColorPicker,
                          arcgisUtils, Print, PrintTemplate, dom, arrayUtils, OverviewMap) {

                    parser.parse();
                    var navToolbar;


                    $rootScope.JordanExtent = new esri.geometry.Extent({
                        "xmin": 3357190.40, "ymin": 3424684.45,
                        "xmax": 4824781.35, "ymax": 3993375.94, "spatialReference": {"wkid": 102100}
                    });

                      $rootScope.map = new esri.Map("map", {
                          sliderOrientation: "vertical",
                          sliderPosition: "bottom-right",
                          sliderStyle: "large",
                          extent: $rootScope.JordanExtent,
                          basemap: "satellite"
                      });

                      var overviewMapDijit = new OverviewMap({
                          map: $rootScope.map,
                          attachTo:"bottom-right",
                          color:"#D84E13",
                          opacity:.40,
                          expandFactor:1,
                          visible: true
                      });
                      overviewMapDijit.startup();

                      /*var home = new esri.dijit.HomeButton({
                       map: $rootScope.map
                       }, "HomeButton");
                       home.startup();*/



                      navToolbar = new Navigation($rootScope.map);
                      on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);

                      var scalebar = new Scalebar({
                          map: $rootScope.map,
                          // "dual" displays both miles and kilmometers
                          // "english" is the default, which displays miles
                          // use "metric" for kilometers
                          scalebarUnit: "metric",
                          attachTo: "bottom-left"
                      });


                      $rootScope.map.on("load", function () {
                      blockUI.start();

                      $timetout(function(){
                          blockUI.stop();
                      },5000);

                      $(".mapToggleMenu").on('click', function(evt){
                          evt.stopPropagation();
                      });

                      $rootScope.$broadcast('mapLoaded', true);
                      //createPrintDijit("Jordan Census");
                      $scope.loadLayers();

                      $rootScope.map.graphics.enableMouseEvents();
                      $rootScope.map.graphics.on("mouse-over", function(evt){
                          if(evt.graphic.attributes && evt.graphic.attributes.id === '_advLandmark') {
                              //$rootScope.map.infoWindow.setTitle("Landmarks");
                              $rootScope.map.infoWindow.setContent(evt.graphic.attributes.EST_NAME);
                              $rootScope.map.infoWindow.show(evt.graphic.geometry, $rootScope.map.getInfoWindowAnchor(evt.graphic.geometry));
                          }
                      });
                      $rootScope.map.graphics.on("mouse-out", function () {
                          if(evt.graphic &&  evt.graphic.attributes
                             && evt.graphic.attributes.id === '_advLandmark'){
                          if($rootScope.map.infoWindow) {
                              $rootScope.map.infoWindow.hide();
                          }
                        }

                      });

                    });


                      $rootScope.map.on('extent-change', function(evt){
                          var s = "";
                          s = "XMin: "+ parseFloat(evt.extent.xmin).toFixed(2) + "&nbsp;"
                              +"YMin: " + parseFloat(evt.extent.ymin).toFixed(2) + "&nbsp;"
                              +"XMax: " + parseFloat(evt.extent.xmax).toFixed(2) + "&nbsp;"
                              +"YMax: " + parseFloat(evt.extent.ymax).toFixed(2);
                          $("#dvExtent").html(s);
                      });

                      $rootScope.map.on("click", function (evt) {
                          if (generalservice.isSearchNearestServiceEnabled) {
                              $rootScope.$broadcast('bufferSearchClicked', evt);
                          }
                      });

                      $rootScope.map.on("update-start", function () {
                          //blockUI.start();
                      });

                      $rootScope.map.on("update-end", function () {
                          blockUI.stop();
                          console.log($rootScope.map.getScale());
                          try{
                                if($rootScope.map.getScale() < 4622324.434309){
                                  $rootScope.map.getLayer("GovernorateLabelLayer").setVisibility(false);
                                  //$rootScope.map._layers["GovernorateLabelLayer"].redraw();
                                }else{
                                  $rootScope.map.getLayer("GovernorateLabelLayer").setVisibility(true);
                                }
                            }catch(ex){
                              console.error(ex);
                            }
                      });

                      $scope.veTileLayer = new esri.virtualearth.VETiledLayer({
                          bingMapsKey: "AhVz53PE5a05Yi0ygzaeB-VbHAAuSXNcIbo6SRrE2hnwfuqAKs-yAfCqN906zxso",
                          mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL
                      });

                      $rootScope.map.addLayer($scope.veTileLayer);

                    //});

                    $("#zoomin").on("click", function () {
                        navToolbar.activate(Navigation.ZOOM_IN);
                    });

                    $("#zoomout").on("click", function () {
                        navToolbar.activate(Navigation.ZOOM_OUT);
                    });

                    $("#zoomfullext").on("click", function () {
                        navToolbar.zoomToFullExtent();
                    });

                    $("#zoomprev").on("click", function () {
                        navToolbar.zoomToPrevExtent();
                    });

                    $("#zoomnext").on("click", function () {
                        navToolbar.zoomToNextExtent();
                    });

                    $("#pan").on("click", function () {
                        navToolbar.activate(Navigation.PAN);
                    });

                    $("#deactivate").on("click", function () {
                        navToolbar.deactivate();
                    });

                    $scope.refreshMap = function () {
                        generalservice.resetAll();
                    };

                    $(".wheel-button").wheelmenu({
                        trigger: "hover",
                        animation: "fly",
                        animationSpeed: "fast"
                    });


                    $scope.showStatisticalReport = false;
                    $scope.ShowStatisticalReportPanel = function () {
                        if ($scope.showStatisticalReport) {
                            $scope.showStatisticalReport = false;
                            $("#resultPanel").hide("bounce");
                            $rootScope.resetSearchPanelFlags();
                        }
                        else {
                            $rootScope.resetSearchPanelFlags();
                            $scope.showStatisticalReport = true;
                            $("#resultPanel").show("bounce");
                            $("#dvStatistical").show();
                        }
                    }

                    function extentHistoryChangeHandler() {
                        $("#zoomprev").disabled = navToolbar.isFirstExtent();
                        $("#zoomnext").disabled = navToolbar.isLastExtent();
                    }



                    $scope.createPrintDijit = function(printTitle) {
                        var layoutTemplate, templateNames, mapOnlyIndex, templates;

                        // create an array of objects that will be used to create print templates
                        var layouts = [{
                            name: "Letter ANSI A Landscape",
                            label: "Landscape (PDF)",
                            format: "pdf",
                            options: {
                                legendLayers: [], // empty array means no legend
                                scalebarUnit: "Miles",
                                titleText: printTitle + ", Landscape PDF"
                            }
                        }, {
                            name: "Letter ANSI A Portrait",
                            label: "Portrait (Image)",
                            format: "jpg",
                            options: {
                                legendLayers: [],
                                scalebarUnit: "Miles",
                                titleText: printTitle + ", Portrait JPG"
                            }
                        }];

                        // create the print templates
                        /*var templates = arrayUtils.map(layouts, function (lo) {
                            var t = new PrintTemplate();
                            t.layout = lo.name;
                            t.label = lo.label;
                            t.format = lo.format;
                            t.layoutOptions = lo.options;
                            return t;
                        });

                        var printer = new Print({
                            map: $rootScope.map,
                            templates: templates,
                            url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                        }, dom.byId("print_button"));

                        printer.startup();
                        */

                        //$("#dijit_form_ComboButton_0_label").text('test');

                    };




                    $scope.GetTemplateInfo = function () {

                    };

                    $scope.SearchLayerSelectionChanged = function () {

                        var QueryTaskOpts = {
                            url: GenerateMapServerUrl($scope.SelectedAdvancedSearchLayer),
                            outFields: ["*"],
                            strWhere: "1=1",
                            returnGeometry: true
                        };

                        esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureSet) {
                            $scope.LayerFeatureNames = featureSet.features;
                            // returning search dropdown
                            //return _featureResult;
                        })
                            .then(function (result) {
                                return result.cbFN(result.response);
                            });
                    }

                    $scope.FindNearestServices = function () {
                        var _infoTemplate = esriLib.GetInfoTemplate("${{LayerName}}".format({LayerName: $rootScope.LayerAttributeName}), "${*}");
                        var layerObj = generalservice.GetLayerObjInfo("BuildingsFeatureLayer");
                        var _featureLayer = esriLib.CreateFeatureLayerInstance(layerObj.strId, layerObj.id, [$rootScope.LayerAttributeName], _infoTemplate);
                        var symbol = esriLib.GetSimpleMarkerSymbol('STYLE_CIRCLE', 12, 'STYLE_NULL', [247, 34, 101, 0.9], 1, [207, 34, 171, 0.5]);

                        _featureLayer.setSelectionSymbol(symbol);

                        var nullSymbol = esriLib.GetSimpleMarkerSymbolEmptyObj().setSize(0);
                        _featureLayer.setRenderer(esriLib.GetSimpleRenderer(nullSymbol));

                    };

                    $scope.ZoomToGeometry = function (geometry) {
                        switch (geometry.type) {
                            case "point":
                                $rootScope.map.centerAndZoom(geometry, 18);
                                break;
                            case "polygon":
                                $rootScope.map.setExtent(geometry.getExtent());
                                break;
                            case "polyline":
                                $rootScope.map.setExtent(geometry.getExtent());
                                break;
                        }
                    }

                    $scope.GetServiceInfo = function (service, isFromDB) {
                        $scope.isSearchNearestServiceEnabled = false;
                        var point;
                        if (isFromDB)
                            point = esriLib.CreatePoint(service.GPS_Y, service.GPS_X, null);
                        else {
                            point = esriLib.CreatePoint(service.attributes.GPS_Y, service.attributes.GPS_X, null);
                            $rootScope.isSearchNearestServiceEnabled = true;
                        }
                        $scope.ZoomToGeometry(point);

                    };

                    // statistical reports

                    $scope.GenerateStatisticalReports = function (reportId, layerId, isPercentage) {
                            statisticalservice.GenerateStatisticalReport(reportId, layerId, isPercentage ? 1 : 0);
                    };

                    $rootScope.resetSearchPanelFlags = function () {
                        $("#dvStatistical").hide();
                        $("#dvNearestService").hide();
                        $("#dvNoServices").hide();
                        $("#dvSearchResultPanel").hide();
                    }

                    $scope.CloseResultPanel = function () {
                        $("#resultPanel").hide("bounce");
                    };

                    $scope.ControlResultPane = function (source) {

                    };

                    $scope.showLayerColorPicker = function () {
                        $("#dvLayerSettings").toggle();
                    };

                });
                });

                $rootScope.$on('languageChanged', function (event, data) {
                    var labelLayers = [];

                    $rootScope.map.removeLayer($scope.GovernorateFeatureLayer);

                    $rootScope.map.removeLayer($scope.SubGovernorateFeatureLayer);
                    $rootScope.map.removeLayer($scope.DistrictFeatureLayer);
                    $rootScope.map.removeLayer($scope.LocalityFeatureLayer);
                    $rootScope.map.removeLayer($scope.RegionsFeatureLayer);
                    $rootScope.map.removeLayer($scope.NeighborhoodsFeatureLayer);
                    labelLayers.push(event.targetScope.map._layers["GovernorateLabelLayer"]);
                    labelLayers.push(event.targetScope.map._layers["SubGovernorateLabelLayer"]);
                    labelLayers.push(event.targetScope.map._layers["DistrictLabelLayer"]);
                    labelLayers.push(event.targetScope.map._layers["LocalityLabelLayer"]);
                    labelLayers.push(event.targetScope.map._layers["RegionsLabelLayer"]);
                    labelLayers.push(event.targetScope.map._layers["NeighbourhoodLabelLayer"]);
                    _.each(labelLayers, function(layer){
                        $rootScope.map.removeLayer(layer);
                    });

                    $scope.AddLayers();

                });
        }]);
