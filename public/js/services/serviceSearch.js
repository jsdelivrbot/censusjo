/**
 * Created by mmajali on 11/13/16.
 */
'use strict';
angular.module('gisapp')
    .factory('serviceSearch', ['$rootScope', 'generalservice', 'esriLib',
        function ($rootScope, generalservice, esriLib) {
            var service = {};

            service.addStreetsGraphicLayer = function (_featureResult) {
                service.removeSearchGraphics();
                var streetsGraphics = esriLib.CreateGraphicsLayer('streetsGraphicsLayer');
                _.each(_featureResult, function (item) {
                    try{
                        var textSymbol;
                        if(!item.geometry.paths[0] || !item.geometry.paths[0].length){
                            console.log('wrong streets', item);
                        }
                        var length = item.geometry.paths[0].length;
                        var angle = computeAngle(item.geometry.paths[0][0], item.geometry.paths[0][length -1]);
                        textSymbol = new esriLib.CreateTextSymbol(item.attributes[$rootScope.getField('LayerAttributeName')], [0, 0, 250, 255], "10pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                        textSymbol.setAngle(angle);
                        var textGraphic = new esriLib.CreateGraphic(item.geometry.getExtent().getCenter(), textSymbol);
                        //textGraphic.visible = false;
                        streetsGraphics.add(textGraphic);
                        //$rootScope.map.graphics.add(textGraphic);
                    }catch(ex){
                        console.log(ex);
                    }
                });
                streetsGraphics.setMinScale(288895.277144);
                $rootScope.map.addLayer(streetsGraphics);
            };

            service.addLandmarksGraphicsLayer = function (list) {
                service.removeSearchGraphics();
                //var landmarkGraphics = esriLib.CreateGraphicsLayer('landmarksGraphicsLayer');
                _.each(list, function (item) {
                    var point = esriLib.CreatePoint(item.GPS_Y, item.GPS_X, null);
                    var _symbol = esriLib.GetPictureMarkerSymbol(generalservice.GetServicesMapIcons(item.ACTIVITY_CODE2), "image/png", 18, 18);
                    var graphic = esriLib.CreateGraphic(point, _symbol);
                    graphic.attributes = {'id': '_advLandmark', EST_NAME: item[$rootScope.getField('EST_NAME')]};
                    //landmarkGraphics.add(graphic);
                    $rootScope.map.graphics.add(graphic);
                });
            };

            service.addLayerGraphicsLayer = function (list) {
                var layerGraphics = esriLib.CreateGraphicsLayer('_normalSearch');
                _.each(list, function(item){

                });
            };

            service.removeIndicatorsGraphics = function () {
                var layer = $rootScope.map.getLayer("_indicatorGraphics");
                if (layer)
                    $rootScope.map.removeLayer(layer);
            };

            service.removeSearchGraphics = function () {
                var layer = $rootScope.map.getLayer("streetsGraphicsLayer");
                if (layer)
                    $rootScope.map.removeLayer(layer);
                layer = $rootScope.map.getLayer("landmarksGraphicsLayer");
                if (layer)
                    $rootScope.map.removeLayer(layer);
                layer = $rootScope.map.getLayer('normalSearchGraphicsLayer');
                if (layer)
                    $rootScope.map.removeLayer(layer);

                try{
                    var graphicsList = _.filter($rootScope.map.graphics.graphics, function (graphic) {
                        return graphic.attributes.id === '_advLandmark' || graphic.attributes.id === '_normalSearch'
                            || graphic.attributes.id === '_advStreets';
                    });

                    _.each(graphicsList, function (g) {
                        $rootScope.map.graphics.remove(g);
                    });
                }catch(ex){

                }
            };

            return service;
        }]);
