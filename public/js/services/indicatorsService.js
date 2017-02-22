/**
 * Created by mmajali on 10/31/16.
 */
'use strict';

angular.module('gisapp')
    .factory('indicatorService', ['$rootScope', 'serviceData', 'esriLib', 'generalservice',
        function ($rootScope, serviceData, esriLib, generalservice) {
            var service = {};

            var chapterNo;
            var variableName;
            var geoCode;
            var layerId;
            var classNo;
            var rgbArray = [];
            var intervalArray = [];
            var indicatorResult = [];

            service.setIndicatorValues = function (_layerId, _chapterNo, _variableName, _geoCode) {
                layerId = _layerId;
                chapterNo = _chapterNo;
                variableName = _variableName;
                geoCode = _geoCode;
            };

            service.generateIndicator = function () {
                serviceData.getIndicatorResults(chapterNo, variableName, geoCode, function (_result) {
                    switch(layerId){
                        case 8:
                            _result = _.reject(_result, function(item){
                                return (item.GEOCODE).toString().length != 2;
                            });
                            break;
                        case 7:
                            _result = _.reject(_result, function(item){
                                return (item.GEOCODE).toString().length != 4;
                            });
                            break;
                        case 6:
                            _result = _.reject(_result, function(item){
                                return (item.GEOCODE).toString().length != 5;
                            });
                            break;
                        case 5:
                            _result = _.reject(_result, function(item){
                                return (item.GEOCODE).toString().length != 8;
                            });
                            break;
                        case 4:
                            _result = _.reject(_result, function(item){
                                return (item.GEOCODE).toString().length != 10;
                            });
                            break;
                        case 3:
                            _result = _.without(_result, function(item){
                                return (item.GEOCODE).toString().length != 12;
                            });
                            break;
                    }
                    $rootScope.$broadcast('indicatorSearchSubmitted', _result);
                    generateInterval(_result);
                    service.drawIndicatorMapGraphics();
                });
            };

            function generateInterval(resultArr) {
                indicatorResult = resultArr;
                var min = _.min(resultArr, function (item) {
                    return item.INDICATORVALUE;
                }).INDICATORVALUE;
                var max = _.max(resultArr, function (item) {
                    return item.INDICATORVALUE;
                }).INDICATORVALUE;

                var interval;
                var tmpClassNo = classNo;
                if(resultArr.length < 3){
                    tmpClassNo = resultArr.length;
                    interval = parseFloat((max - min) / resultArr.length).toFixed(1);
                }else{
                    interval = parseFloat((max - min) / classNo).toFixed(1);
                }

                intervalArray = _.map(new Array(tmpClassNo), function (val, index) {
                    return parseFloat(parseFloat(min + (index * interval)).toFixed(1));
                });

                generateLegend(max);
                generateChart(max);
            }

            function generateLegend(max) {
                var legendArray = [];

                _.each(intervalArray, function (item, index) {
                    if (intervalArray.length == (index + 1)) {
                        legendArray.push({
                            label: "{from} - {to}".format({from: numberWithCommas(item), to:numberWithCommas(max.toFixed(1))}),
                            color: rgbArray[index]
                        });
                    } else {
                        legendArray.push({
                            label: "{from} - {to}".format({
                                from: numberWithCommas(item),
                                to: numberWithCommas(parseFloat(intervalArray[index + 1] - 0.1).toFixed(1))
                            }),
                            color: rgbArray[index]
                        });
                    }
                });

                $rootScope.$broadcast('legendLoaded', legendArray);
            }

            function rgb2hex(rgb) {
                rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
            }

            function getrgbComponent(rgb) {
                return rgb.substring(4, rgb.length - 1)
                    .replace(/ /g, '')
                    .split(',');
            }

            function generateChart(max) {
                var chartObj = {
                    data: intervalArray,
                    labels: [],
                    backgroundColor: [],
                    percentage: []
                };

                var percentage = Array.apply(null, Array(classNo)).map(function () {return 0;})

                // calculate percentage
                _.each(indicatorResult, function(obj){
                    _.each(intervalArray, function(item, index){
                        if(intervalArray.length != (index + 1) ){
                            if(obj.INDICATORVALUE >= intervalArray[index] && obj.INDICATORVALUE < intervalArray[index+1]){
                               percentage[index]++;
                               return false;
                            }
                        }else {
                            percentage[index]++;
                            return false;
                        }
                    });
                });

                var total = _.reduce(percentage, function(mem, num){
                    return mem + num;
                }, 0);

                /*percentage =  _.map(percentage, function(num){
                    return num/total;
                });*/

                _.each(intervalArray, function (item, index) {
                    if (intervalArray.length == (index + 1)) {
                        chartObj.labels.push("{from} - {to}".format({from: item, to: max.toFixed(1)}));
                        chartObj.percentage.push(percentage[index]);
                    } else {
                        chartObj.labels.push("{from} - {to}".format({
                            from: item,
                            to: parseFloat(intervalArray[index + 1] - 0.1).toFixed(1)
                        }));
                        chartObj.percentage.push(percentage[index]);
                    }
                    chartObj.backgroundColor.push(rgbArray[index]);
                });

                $rootScope.$broadcast('indicatorChartDataLoaded', chartObj);
            }

            service.setClassificationNo = function (_classNo) {
                classNo = _classNo;
            };

            service.setRGBArray = function (_rgbArray) {
                rgbArray = _rgbArray;
            };

            $rootScope.$on('classificationNoChanged', function(event, colorBrewerObj){
                service.setClassificationNo(colorBrewerObj.classNo);
                service.setRGBArray(colorBrewerObj.rgb);
                if(indicatorResult && indicatorResult.length > 0) {
                    generateInterval(indicatorResult);
                    service.drawIndicatorMapGraphics();
                }
            });

            $rootScope.$on('colorBrewerChanged', function(event, colorBrewerObj){
                service.setRGBArray(colorBrewerObj.rgb);
                if(indicatorResult && indicatorResult.length > 0) {
                    generateInterval(indicatorResult);
                    service.drawIndicatorMapGraphics();
                }
            });

            service.drawIndicatorMapGraphics = function () {
                generalservice.removeIndicatorsGraphics();
                try {
                    async.waterfall([
                        function (callback) {
                            var QueryTaskOpts = {
                                url: GenerateMapServerUrl(layerId),
                                outFields: ['*'],
                                strWhere: "1 = 1",
                                returnGeometry: true
                            };

                            esriLib.InvokeQueryTask(QueryTaskOpts, true, function (featureList) {
                                callback(null, featureList.features);
                            }).then(function (result) {
                                result.cbFN(result.response);
                            });
                        }
                    ], function (err, features) {
                        var indicatorGraphicLayer = esriLib.CreateGraphicsLayer('_indicatorGraphics');
                        $.each(features, function (index, feature) {
                            var indicatorObj;
                            switch (layerId) {
                                case 8:
                                    indicatorObj = _.findWhere(indicatorResult, {GEOCODE: parseInt(feature.attributes.GOVCODE)});
                                    feature.attributes.INDICATORVALUE = indicatorObj == undefined ? 0 : indicatorObj.INDICATORVALUE;
                                    break;
                                case 7:
                                    indicatorObj = _.findWhere(indicatorResult, {GEOCODE: parseInt(feature.attributes.DISTCODE)});
                                    feature.attributes.INDICATORVALUE = indicatorObj == undefined ? 0 : indicatorObj.INDICATORVALUE;
                                    break;
                                case 6:
                                    indicatorObj = _.findWhere(indicatorResult, {GEOCODE: parseInt(feature.attributes.SUBDISTCODE)});
                                    feature.attributes.INDICATORVALUE = indicatorObj == undefined ? 0 : indicatorObj.INDICATORVALUE;
                                    break;
                                case 5:
                                    indicatorObj = _.findWhere(indicatorResult, {GEOCODE: parseInt(feature.attributes.LOCCODE)});
                                    feature.attributes.INDICATORVALUE = indicatorObj == undefined ? 0 : indicatorObj.INDICATORVALUE;
                                    break;
                                case 4:
                                    indicatorObj = _.findWhere(indicatorResult, {GEOCODE: parseInt(feature.attributes.AREACODE)});
                                    feature.attributes.INDICATORVALUE = indicatorObj == undefined ? 0 : indicatorObj.INDICATORVALUE;
                                    break;
                                case 3:
                                    indicatorObj = _.findWhere(indicatorResult, {GEOCODE: parseInt(feature.attributes.NHCODE)});
                                    feature.attributes.INDICATORVALUE = indicatorObj == undefined ? 0 : indicatorObj.INDICATORVALUE;
                                    break;
                            }
                            if(!indicatorObj){
                                return;
                            }
                            var symbol;
                            var fillColor;
                            indicatorObj.INDICATORVALUE = parseFloat(parseFloat(indicatorObj.INDICATORVALUE).toFixed(1));
                            $.each(intervalArray, function (index, val) {
                                if (intervalArray.length != (index + 1)) {
                                    if (indicatorObj.INDICATORVALUE >= val && indicatorObj.INDICATORVALUE <= (intervalArray[index + 1] - 0.1)) {
                                        fillColor = getrgbComponent(rgbArray[index]);
                                        fillColor.push(0.7);
                                        return false;
                                    }
                                } else {
                                    if(indicatorObj.INDICATORVALUE >= val) {
                                        fillColor = getrgbComponent(rgbArray[index]);
                                        fillColor.push(0.7);
                                        return false;
                                    }
                                }
                            });

                            symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_SOLID", [0, 38, 115, 0.7], 2, fillColor);
                            var graphic = esriLib.CreateGraphic(feature.geometry, symbol, feature.attributes, null);
                            indicatorGraphicLayer.add(graphic);
                        });
                        $rootScope.map.addLayer(indicatorGraphicLayer);
                    });
                } catch (ex) {

                }
            };

            return service;

        }]);
