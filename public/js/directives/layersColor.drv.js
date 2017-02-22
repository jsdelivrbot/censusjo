/**
 * Created by mmajali on 11/9/16.
 */
'use strict';
angular.module('gisapp')
    .directive('layersColor', function () {

        var colorCtrl = function ($rootScope, $scope, $timeout, esriLib) {
            $scope.lstLayers = [];
            $scope.selectedColor = "#FF0000";

            $scope.colorPickerOptions = {
                round: false,
                pos: 'bottom left',
                placeholder: '',
                swatchOnly: true,
                format: 'rgb'
            };

            $rootScope.$on('resetAll', function(event, data){
              $scope.clrSeclectedLayer = undefined;
              $scope.clrSelectedArea = undefined;
              $scope.clrFontFamily = undefined;
              $scope.clrFontSize = undefined;
              $scope.clrFontWeight = undefined;
              
              $timeout(function () {
                  $('#clrLayer').niceSelect('update');
                  $('#colorArea').niceSelect('update');
                  $("#ddlFontFamily").niceSelect('update');
                  $("#ddlFontSize").niceSelect('update');
                  $("#ddlFontWeight").niceSelect('update');
              }, 500);
            });

            $rootScope.$on('languageChanged', function (event, data) {
                $timeout(function () {
                    $('#clrLayer').niceSelect('update');
                    $('#colorArea').niceSelect('update');
                    $("#ddlFontFamily").niceSelect('update');
                    $("#ddlFontSize").niceSelect('update');
                    $("#ddlFontWeight").niceSelect('update');
                }, 500);
            });

            $scope.eventApi = {
                onChange: function (api, color, $event) {
                    var convertedColor = toRGBArray(color);
                    $scope.selectedColor = {
                        r: convertedColor[0],
                        g: convertedColor[1],
                        b: convertedColor[2],
                        a: convertedColor.length == 4 ? convertedColor[3] : 1
                    };
                    if ($scope.clrSeclectedLayer && $scope.clrSelectedArea) {
                        var layer = _.findWhere($rootScope.MapLayers, {id: $scope.clrSeclectedLayer});
                        var selectedLayerColor = $scope.map._layers[layer.strId];
                        switch ($scope.clrSelectedArea.id) {
                            case 1:
                                selectedLayerColor.renderer.symbol.color = esriLib.generateColor($scope.selectedColor);
                                selectedLayerColor.refresh();
                                break;
                            case 2:
                                selectedLayerColor.renderer.symbol.outline.color = esriLib.generateColor($scope.selectedColor);
                                selectedLayerColor.refresh();
                                break;
                        }
                    }
                }
            }

            $rootScope.$on('translationChanged', function (event, data) {

                $scope.layersDisplayName = data.DisplayLayers;
                $scope.fieldName = data.fieldName;
                $scope.selectLayerText = data.SelectLayerText;
                //$scope.selectOption = data.SelectText;
            });

            $rootScope.$on('layersDataLoaded', function (event, data) {
                $scope.colorArea = data.colorArea;
                $timeout(function () {
                    $("#colorArea").niceSelect();
                }, 500);
            });

            $rootScope.$on('layersForServices', function (event, data) {
                $scope.lstLayers = data;
                $timeout(function () {
                    $('#clrLayer').niceSelect();
                }, 500);
            });

            $timeout(function () {
                /*$(".layerColorPicker").colorPicker({
                 cssAddon:'.cp-color-picker{border:1px solid #999; padding:10px 10px 0;background:#eee; overflow:visible; border-radius:3px;direction: ltr; z-index: 99999999}.cp-color-picker:after{content:""; display:block; position:absolute; top:-15px; left:12px; border:8px solid #eee;border-color: transparent transparent #eee}.cp-color-picker:before{content:""; display:block; position:absolute; top:-16px; left:12px; border:8px solid #eee;border-color: transparent transparent #999}.cp-xy-slider:active {cursor:none;}.cp-xy-slider{border:1px solid #999; margin-bottom:10px;}.cp-xy-cursor{width:12px; height:12px; margin:-6px}.cp-z-slider{margin-left:10px; border:1px solid #999;}.cp-z-cursor{border-width:5px; margin-top:-5px;}.cp-color-picker .cp-alpha{margin:10px 0 0; height:6px; border-radius:6px;overflow:visible; border:1px solid #999; box-sizing:border-box;background: linear-gradient(to right, rgba(238,238,238,1) 0%,rgba(238,238,238,0) 100%);}.cp-color-picker .cp-alpha{margin:10px 0}.cp-alpha-cursor{background: #eee; border-radius: 100%;width:14px; height:14px; margin:-5px -7px; border:1px solid #666!important;box-shadow:inset -2px -4px 3px #ccc}',
                 customBG: "#222",
                 doRender: "div div"
                 });
                 $(".layerColorPicker").on('change', function(evt){
                 console.log(evt);
                 });*/
            }, 500);

            $scope.onColorChanged = function () {
                console.log($scope.selectedColor);
            }

            $scope.fontFamily = ["Arial", "cursive", "Droid Arabic Naskh", "fantasy", "monospace", "serif", "Times", "Times New Roman"];
            $scope.fontSize = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            $scope.fontWeight = [100, 200, 300, 400, 500, 600, 700, 800, 900, "bold", "bolder"];

            $timeout(function () {
                $('#ddlFontFamily').niceSelect();
                $('#ddlFontSize').niceSelect();
                $('#ddlFontWeight').niceSelect();
            }, 500);
            $scope.changeFontFamily = function(){
                switch($scope.clrSeclectedLayer){
                    case 8:
                        $("#GovernorateLabelLayer_layer > text").css("font-family", $scope.clrFontFamily);
                        break;
                    case 7:
                        $("#SubGovernorateLabelLayer_layer > text").css("font-family", $scope.clrFontFamily);
                        break;
                     case 6:
                         $("#DistrictLabelLayer_layer > text").css("font-family", $scope.clrFontFamily);
                         break;
                     case 5:
                         $("#LocalityLabelLayer_layer > text").css("font-family", $scope.clrFontFamily);
                         break;
                     case 4:
                         $("#RegionsLabelLayer_layer > text").css("font-family", $scope.clrFontFamily);
                         break;
                     case 3:
                         $("#NeighbourhoodLabelLayer_layer > text").css("font-family", $scope.clrFontFamily);
                         break;
                }
            };

            $scope.changeFontSize = function(){
                switch($scope.clrSeclectedLayer){
                    case 8:
                        $("#GovernorateLabelLayer_layer > text").css("font-size", $scope.clrFontSize);
                        break;
                    case 7:
                        $("#SubGovernorateLabelLayer_layer > text").css("font-size", $scope.clrFontSize);
                        break;
                     case 6:
                         $("#DistrictLabelLayer_layer > text").css("font-size", $scope.clrFontSize);
                         break;
                     case 5:
                         $("#LocalityLabelLayer_layer > text").css("font-size", $scope.clrFontSize);
                         break;
                     case 4:
                         $("#RegionsLabelLayer_layer > text").css("font-size", $scope.clrFontSize);
                         break;
                     case 3:
                         $("#NeighbourhoodLabelLayer_layer > text").css("font-size", $scope.clrFontSize);
                         break;
                }
            };

            $scope.changeFontWeight = function(){
                switch($scope.clrSeclectedLayer){
                    case 8:
                        $("#GovernorateLabelLayer_layer > text").css("font-weight", $scope.clrFontWeight);
                        break;
                    case 7:
                        $("#SubGovernorateLabelLayer_layer > text").css("font-weight", $scope.clrFontWeight);
                        break;
                     case 6:
                         $("#DistrictLabelLayer_layer > text").css("font-weight", $scope.clrFontWeight);
                         break;
                     case 5:
                         $("#LocalityLabelLayer_layer > text").css("font-weight", $scope.clrFontWeight);
                         break;
                     case 4:
                         $("#RegionsLabelLayer_layer > text").css("font-weight", $scope.clrFontWeight);
                         break;
                     case 3:
                         $("#NeighbourhoodLabelLayer_layer > text").css("font-weight", $scope.clrFontWeight);
                         break;
                }
            };
        };

        return {
            restrict: 'E',
            require: '^layersColor',
            templateUrl: 'views/tpl/coloringLayers.tpl.html',
            controller: colorCtrl
        }
    });
