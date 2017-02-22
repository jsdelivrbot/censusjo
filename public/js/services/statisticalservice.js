'use strict'

angular.module('gisapp')
    .factory('statisticalservice', ['$rootScope', '$translate', 'serviceBase', 'generalservice', 'esriLib', 'serviceData',
        function ($rootScope, $translate, serviceBase, generalservice, esriLib, serviceData) {
            var service = {};
            service.LayerAttributeName;
            $translate(['StatisticalReports', 'LayerAttributeName', 'SelectLayerWarning']).then(function (translations) {
                service.StatisticalReportsText = translations.StatisticalReports;
                service.LayerAttributeName = translations.LayerAttributeName;
                service.SelectLayerWarning = translations.SelectLayerWarning;
            });

            $rootScope.statisticalReportsLegend = [];

            $rootScope.GetStatisticalReportLegend = function (reportId) {
                if (reportId) {
                    var legendObj = $rootScope.statisticalReportsLegend.find(function (item) {
                        return item.id == reportId;
                    });
                    return legendObj.legend;
                } else {
                    return [];
                }
            };

            service.StatisticalLegendCreator = function (list) {
                $rootScope.statisticalReportsLegend = [];
                $.each(list, function (index, item) {
                    switch (index) {
                        case 0:
                            $rootScope.statisticalReportsLegend.push({
                                label: " < {val}".format({val: item}),
                                color: "rgba(173, 173, 230, 1)"
                            });
                            break;
                        case 1:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: "{val1} - {val2}".format({val1: list[index - 1], val2: item}),
                                    color: "rgba(0, 169, 230, 1)"
                                }
                            );
                            break;
                        case 2:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: "{val1} - {val2}".format({val1: list[index - 1], val2: item}),
                                    color: "rgba(230, 230, 0, 1)"
                                }
                            );
                            break;
                        case 3:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: "{val1} - {val2}".format({val1: list[index - 1], val2: item}),
                                    color: "rgba(255, 170, 0, 1)"
                                }
                            );
                            break;
                        case 4:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: "{val1} - {val2}".format({val1: list[index - 1], val2: item}),
                                    color: "rgba(230, 76, 0, 1)"
                                }
                            );
                            break;
                        case 5:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: "{val1} - {val2}".format({val1: list[index - 1], val2: item}),
                                    color: "rgba(76, 230, 0, 1)"
                                }
                            );
                            break;
                        case 6:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: "{val1} - {val2}".format({val1: list[index - 1], val2: item}),
                                    color: "rgba(230, 0, 0, 1)"
                                }
                            );
                            break;
                        case 7:
                            $rootScope.statisticalReportsLegend.push(
                                {
                                    label: " > {val}".format({val: list[index - 1]}),
                                    color: "rgba(169, 0, 230, 1)"
                                }
                            );
                            break;
                    }
                });
            };

            service.GetStatisticalReportsSymbology = function (count, statisticalArr) {
                var _symbol;
                switch (true) {
                    case count < statisticalArr[0]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [173, 173, 230, 1]);
                        break;
                    case count >= statisticalArr[0] && count < statisticalArr[1]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [0, 169, 230, 1]);
                        break;
                    case count >= statisticalArr[1] && count < statisticalArr[2]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [230, 230, 0, 1]);
                        break;
                    case count >= statisticalArr[2] && count < statisticalArr[3]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [255, 170, 0, 1]);
                        break;
                    case count >= statisticalArr[3] && count < statisticalArr[4]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [230, 76, 0, 1]);
                        break;
                    case count >= statisticalArr[4] && count < statisticalArr[5]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [76, 230, 0, 1]);
                        break;
                    case count >= statisticalArr[5] && count < statisticalArr[6]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [230, 0, 0, 1]);
                        break;
                    case count > statisticalArr[6]:
                        _symbol = esriLib.GetSimpleFillSymbol("STYLE_SOLID", "STYLE_LONGDASH", [0, 38, 115, 1], 2, [169, 0, 230, 1]);
                        break;

                }
                return _symbol;
            };

            service.initialize = function () {
                serviceBase.HttpRequest.Query({url: '/statisticalreports.json', data: {}}, function (response) {
                    $rootScope.statisticalreports = response;
                });
            };

            service.GenerateStatisticalReport = function (reportId, layerId, isPercentage) {
                try {
                    if (!layerId) {
                        serviceBase.showWarningNotification(service.statisticalreports, service.SelectLayerWarning);
                        return;
                    }

                    if (!reportId)
                        return;

                    generalservice.ClearGraphics();
                    switch (reportId) {
                        case 1:
                            service.getNumberOfBuildings2(layerId, isPercentage, function () {

                            });

                            break;
                        case 2:
                            service.GetNumberOfHouses(layerId, isPercentage, function () {

                            });
                            break;
                        case 3:
                            service.GetNumberOfFamilies(layerId, isPercentage, function () {

                            });
                            break;
                        case 4:
                            service.GetNumberOfMembers(layerId, isPercentage, function () {

                            });
                            break;
                        case 5:
                            service.GetNumberOfJordanians(layerId, isPercentage, function () {

                            });
                            break;
                        case 6:
                            service.GetNumberOfNonJordanians(layerId, isPercentage, function () {

                            });
                            break;
                        case 7:
                            service.GetNumberOfEstablishments(layerId, isPercentage, function () {

                            });
                            break;
                    }
                } catch (ex) {
                    serviceBase.showErrorNotification(service.StatisticalReportsText, ex);
                }
            };

            service.getNumberOfBuildings2 = function (layerId, isPercentage, callback) {
                var indicatorFeatureLayer;
                try {
                    async.waterfall([
                        function (callback) {
                            indicatorFeatureLayer =
                                esriLib.CreateFeatureLayerInstance('indicatorLayer', layerId, ['*']);

                            indicatorFeatureLayer.on('update-end', function (arg) {
                                callback(null, arg.target.graphics);
                            });

                            $rootScope.map.addLayer(indicatorFeatureLayer);
                        },
                        function (features, callback) {
                            serviceData.getBuildingsCountsIndicator(layerId, isPercentage, function (response) {
                                callback(response.error, features, response.list);
                            });
                        }
                    ], function (err, features, list) {
                        if (err)
                            serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                        else {
                            var max = _.max(list, function (item) {
                                return item.BLD_CNT;
                            }).BLD_CNT;

                            if (isPercentage) {
                                max = parseFloat(max * 100).toFixed(2);
                            }
                            var min = parseInt(max / 8);

                            var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                                return parseInt(index + 1) * min;
                            });

                            service.StatisticalLegendCreator(statisticalArr);

                            $.each(features, function (index, feature) {
                                var BLDCount;
                                switch (layerId) {
                                    case 8:
                                        BLDCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                        feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                        break;
                                    case 7:
                                        BLDCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                        feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                        break;
                                    case 6:
                                        BLDCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                        feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                        break;
                                    case 5:
                                        BLDCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                        feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                        break;
                                    case 4:
                                        BLDCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                        feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                        break;
                                    case 3:
                                        BLDCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                        feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                        break;
                                }

                                if (isPercentage)
                                    feature.attributes.BLDCOUNT = parseFloat(feature.attributes.BLDCOUNT * 100).toFixed(2);

                                var count = feature.attributes.BLDCOUNT;
                            });
                            esriLib.defineClassBreakDefinition(indicatorFeatureLayer, 'BLDCOUNT', "#ffffcc", "#006837", layerId);
                            console.log('test');
                        }
                    });
                } catch (ex) {
                    alert(ex);
                }
            };

            service.GetNumberOfEstablishments = function (layerId, isPercentage, callback) {
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
                        },
                        function (features, callback) {
                            serviceBase.HttpRequest.Save({
                                url: '/statisticalreports/GetEstablishmentsCounts',
                                data: {layerId: layerId, isPercentage: isPercentage}
                            }, function (response) {
                                callback(response.error, features, response.list);
                            });
                        }
                    ], function (err, features, list) {
                        if (err)
                            serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                        else {
                            var max = _.max(list, function (item) {
                                return item.EST_CNT;
                            }).EST_CNT;

                            if (isPercentage) {
                                max = parseFloat(max * 100).toFixed(2);
                            }

                            var min = parseInt(max / 8);

                            var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                                return parseInt(index + 1) * min;
                            });

                            service.StatisticalLegendCreator(statisticalArr);

                            $.each(features, function (index, feature) {
                                var EstCount;
                                switch (layerId) {
                                    case 8:

                                        EstCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                        feature.attributes.ESTCOUNT = EstCount == undefined ? 0 : EstCount.EST_CNT;
                                        break;
                                    case 7:
                                        EstCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                        feature.attributes.ESTCOUNT = EstCount == undefined ? 0 : EstCount.EST_CNT;
                                        break;
                                    case 6:
                                        EstCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                        feature.attributes.ESTCOUNT = EstCount == undefined ? 0 : EstCount.EST_CNT;
                                        break;
                                    case 5:
                                        EstCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                        feature.attributes.ESTCOUNT = EstCount == undefined ? 0 : EstCount.EST_CNT;
                                        break;
                                    case 4:
                                        EstCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                        feature.attributes.ESTCOUNT = EstCount == undefined ? 0 : EstCount.EST_CNT;
                                        break;
                                    case 3:
                                        EstCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                        feature.attributes.ESTCOUNT = EstCount == undefined ? 0 : EstCount.EST_CNT;
                                        break;
                                }

                                if (isPercentage)
                                    feature.attributes.ESTCOUNT = parseFloat(feature.attributes.ESTCOUNT * 100).toFixed(2);

                                var count = feature.attributes.ESTCOUNT;

                                var _symbol;
                                _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                                var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                                $rootScope.map.graphics.add(graphic);
                                var textSymbol;
                                if (isPercentage)
                                    textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                                else
                                    textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));

                                var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                                $rootScope.map.graphics.add(textGraphic);
                            });
                        }
                    });
                } catch (ex) {
                    alert(ex);
                }

                /* code to be removed
                 var layerDefinition = {
                 "geometryType": "esriGeometryPolygon",
                 "objectIdField": "OBJECTID",
                 "fields": [
                 {
                 "name": "OBJECTID",
                 "type": "esriFieldTypeOID",
                 "alias": "OBJECTID"
                 },
                 {
                 "name": "ESTCOUNT",
                 "type": "esriFieldTypeInteger",
                 "alias": "Establishments Count"
                 },
                 {
                 "name": service.LayerAttributeName,
                 "type": "esriFieldTypeString",
                 "alias": "NAME"
                 }]
                 };

                 var featureCollection = {
                 "layerDefinition": layerDefinition,
                 "featureSet": {
                 "features": features,
                 "geometryType": "esriGeometryPolygon"
                 }
                 };
                 var featureLayer = esriLib.CreateFeatureLayerInstance('ddd', layerId, ['POPULATION'], null);
                 //var featureLayer = esriLib.CreateFeatureLayerByCollection(featureCollection, 'ss', null);
                 var SubGovernorateRender = esriLib.CreateFillRenderer("STYLE_SOLID", [128, 0, 63, 0.8], 3, "STYLE_SOLID", [255, 0, 255, 0.05]);
                 featureLayer.setRenderer(SubGovernorateRender);
                 featureLayer.on('load', function(){
                 featureLayer.graphics = features;
                 esriLib.CreateSmartMapping(featureLayer, 'POPULATION');
                 });
                 $rootScope.map.addLayer(featureLayer);
                 */

            };

            service.getNumberOfBuildings = function (layerId, isPercentage, callback) {

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

                    },
                    function (features, callback) {
                        serviceBase.HttpRequest.Save({
                            url: '/statisticalreports/GetBuildingsCounts',
                            data: {layerId: layerId, isPercentage: isPercentage}
                        }, function (response) {
                            callback(response.error, features, response.list);
                        });
                    }
                ], function (err, features, list) {
                    if (err)
                        serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                    else {
                        var max = _.max(list, function (item) {
                            return item.BLD_CNT;
                        }).BLD_CNT;

                        if (isPercentage) {
                            max = parseFloat(max * 100).toFixed(2);
                        }
                        var min = parseInt(max / 8);

                        var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                            return parseInt(index + 1) * min;
                        });

                        service.StatisticalLegendCreator(statisticalArr);

                        $.each(features, function (index, feature) {
                            var BLDCount;
                            switch (layerId) {
                                case 8:
                                    BLDCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                    feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                    break;
                                case 7:
                                    BLDCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                    feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                    break;
                                case 6:
                                    BLDCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                    feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                    break;
                                case 5:
                                    BLDCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                    feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                    break;
                                case 4:
                                    BLDCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                    feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                    break;
                                case 3:
                                    BLDCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                    feature.attributes.BLDCOUNT = BLDCount == undefined ? 0 : BLDCount.BLD_CNT;
                                    break;
                            }

                            if (isPercentage)
                                feature.attributes.BLDCOUNT = parseFloat(feature.attributes.BLDCOUNT * 100).toFixed(2);

                            var count = feature.attributes.BLDCOUNT;

                            var _symbol;
                            _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                            var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                            $rootScope.map.graphics.add(graphic);
                            var textSymbol;
                            if (isPercentage)
                                textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            else
                                textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));

                            var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                            $rootScope.map.graphics.add(textGraphic);
                        });
                    }
                });
            };

            service.GetNumberOfHouses = function (layerId, isPercentage, callback) {

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
                    },
                    function (features, callback) {
                        serviceBase.HttpRequest.Save({
                            url: '/statisticalreports/GetHousesCounts',
                            data: {layerId: layerId, isPercentage: isPercentage}
                        }, function (response) {
                            callback(response.error, features, response.list);
                        });
                    }
                ], function (err, features, list) {
                    if (err)
                        serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                    else {
                        var max = _.max(list, function (item) {
                            return item.HOU_CNT;
                        }).HOU_CNT;

                        if (isPercentage) {
                            max = parseFloat(max * 100).toFixed(2);
                        }

                        var min = parseInt(max / 8);

                        var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                            return parseInt(index + 1) * min;
                        });

                        service.StatisticalLegendCreator(statisticalArr);

                        $.each(features, function (index, feature) {
                            var HouCount;
                            switch (layerId) {
                                case 8:
                                    HouCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                    feature.attributes.HOUCOUNT = HouCount == undefined ? 0 : HouCount.HOU_CNT;
                                    break;
                                case 7:
                                    HouCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                    feature.attributes.HOUCOUNT = HouCount == undefined ? 0 : HouCount.HOU_CNT;
                                    break;
                                case 6:
                                    HouCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                    feature.attributes.HOUCOUNT = HouCount == undefined ? 0 : HouCount.HOU_CNT;
                                    break;
                                case 5:
                                    HouCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                    feature.attributes.HOUCOUNT = HouCount == undefined ? 0 : HouCount.HOU_CNT;
                                    break;
                                case 4:
                                    HouCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                    feature.attributes.HOUCOUNT = HouCount == undefined ? 0 : HouCount.HOU_CNT;
                                    break;
                                case 3:
                                    HouCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                    feature.attributes.HOUCOUNT = HouCount == undefined ? 0 : HouCount.HOU_CNT;
                                    break;
                            }

                            if (isPercentage)
                                feature.attributes.HOUCOUNT = parseFloat(feature.attributes.HOUCOUNT * 100).toFixed(2);

                            var count = feature.attributes.HOUCOUNT;
                            var _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                            var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                            $rootScope.map.graphics.add(graphic);
                            var textSymbol;
                            if (isPercentage)
                                textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            else
                                textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                            $rootScope.map.graphics.add(textGraphic);
                        });
                    }
                });
            };

            service.GetNumberOfFamilies = function (layerId, isPercentage, callback) {

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
                    },
                    function (features, callback) {
                        serviceBase.HttpRequest.Save({
                            url: '/statisticalreports/GetFamilyCounts',
                            data: {layerId: layerId, isPercentage: isPercentage}
                        }, function (response) {
                            callback(response.error, features, response.list);
                        });
                    }
                ], function (err, features, list) {
                    if (err)
                        serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                    else {
                        var max = _.max(list, function (item) {
                            return item.FM_CNT;
                        }).FM_CNT;

                        if (isPercentage) {
                            max = parseFloat(max * 100).toFixed(2);
                        }

                        var min = parseInt(max / 8);

                        var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                            return parseInt(index + 1) * min;
                        });

                        service.StatisticalLegendCreator(statisticalArr);

                        $.each(features, function (index, feature) {
                            var FMCount;
                            switch (layerId) {
                                case 8:
                                    FMCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                    feature.attributes.FMCOUNT = FMCount == undefined ? 0 : FMCount.FM_CNT;
                                    break;
                                case 7:
                                    FMCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                    feature.attributes.FMCOUNT = FMCount == undefined ? 0 : FMCount.FM_CNT;
                                    break;
                                case 6:
                                    FMCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                    feature.attributes.FMCOUNT = FMCount == undefined ? 0 : FMCount.FM_CNT;
                                    break;
                                case 5:
                                    FMCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                    feature.attributes.FMCOUNT = FMCount == undefined ? 0 : FMCount.FM_CNT;
                                    break;
                                case 4:
                                    FMCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                    feature.attributes.FMCOUNT = FMCount == undefined ? 0 : FMCount.FM_CNT;
                                    break;
                                case 3:
                                    FMCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                    feature.attributes.FMCOUNT = FMCount == undefined ? 0 : FMCount.FM_CNT;
                                    break;
                            }

                            if (isPercentage)
                                feature.attributes.FMCOUNT = parseFloat(feature.attributes.FMCOUNT * 100).toFixed(2);

                            var count = feature.attributes.FMCOUNT;
                            var _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                            var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                            $rootScope.map.graphics.add(graphic);
                            var textSymbol;
                            if (isPercentage)
                                textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            else
                                textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));

                            var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                            $rootScope.map.graphics.add(textGraphic);
                        });
                    }
                });
            };

            service.GetNumberOfMembers = function (layerId, isPercentage, callback) {

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
                    },
                    function (features, callback) {
                        serviceBase.HttpRequest.Save({
                            url: '/statisticalreports/GetMemberCounts',
                            data: {layerId: layerId, isPercentage: isPercentage}
                        }, function (response) {
                            callback(response.error, features, response.list);
                        });
                    }
                ], function (err, features, list) {
                    if (err)
                        serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                    else {
                        var max = _.max(list, function (item) {
                            return item.MEM_CNT;
                        }).MEM_CNT;

                        if (isPercentage) {
                            max = parseFloat(max * 100).toFixed(2);
                        }

                        var min = parseInt(max / 8);

                        var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                            return parseInt(index + 1) * min;
                        });

                        service.StatisticalLegendCreator(statisticalArr);

                        $.each(features, function (index, feature) {
                            var MEMCount;
                            switch (layerId) {
                                case 8:
                                    MEMCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                    feature.attributes.MEMCOUNT = MEMCount == undefined ? 0 : MEMCount.MEM_CNT;
                                    break;
                                case 7:
                                    MEMCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                    feature.attributes.MEMCOUNT = MEMCount == undefined ? 0 : MEMCount.MEM_CNT;
                                    break;
                                case 6:
                                    MEMCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                    feature.attributes.MEMCOUNT = MEMCount == undefined ? 0 : MEMCount.MEM_CNT;
                                    break;
                                case 5:
                                    MEMCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                    feature.attributes.MEMCOUNT = MEMCount == undefined ? 0 : MEMCount.MEM_CNT;
                                    break;
                                case 4:
                                    MEMCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                    feature.attributes.MEMCOUNT = MEMCount == undefined ? 0 : MEMCount.MEM_CNT;
                                    break;
                                case 3:
                                    MEMCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                    feature.attributes.MEMCOUNT = MEMCount == undefined ? 0 : MEMCount.MEM_CNT;
                                    break;
                            }

                            if (isPercentage)
                                feature.attributes.MEMCOUNT = parseFloat(feature.attributes.MEMCOUNT * 100).toFixed(2);

                            var count = feature.attributes.MEMCOUNT;
                            var _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                            var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                            $rootScope.map.graphics.add(graphic);
                            var textSymbol;
                            if (isPercentage)
                                textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            else
                                textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));

                            var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                            $rootScope.map.graphics.add(textGraphic);
                        });
                    }
                });
            };

            service.GetNumberOfJordanians = function (layerId, isPercentage, callback) {

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
                    },
                    function (features, callback) {
                        serviceBase.HttpRequest.Save({
                            url: '/statisticalreports/GetJordaniansCount',
                            data: {layerId: layerId, isPercentage: isPercentage}
                        }, function (response) {
                            callback(response.error, features, response.list);
                        });
                    }
                ], function (err, features, list) {
                    if (err)
                        serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                    else {
                        var max = _.max(list, function (item) {
                            return item.JO_CNT;
                        }).JO_CNT;

                        if (isPercentage) {
                            max = parseFloat(max * 100).toFixed(2);
                        }

                        var min = parseInt(max / 8);

                        var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                            return parseInt(index + 1) * min;
                        });

                        service.StatisticalLegendCreator(statisticalArr);

                        $.each(features, function (index, feature) {
                            var JoCount;
                            switch (layerId) {
                                case 8:
                                    JoCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                    feature.attributes.JOCOUNT = JoCount == undefined ? 0 : JoCount.JO_CNT;
                                    break;
                                case 7:
                                    JoCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                    feature.attributes.JOCOUNT = JoCount == undefined ? 0 : JoCount.JO_CNT;
                                    break;
                                case 6:
                                    JoCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                    feature.attributes.JOCOUNT = JoCount == undefined ? 0 : JoCount.JO_CNT;
                                    break;
                                case 5:
                                    JoCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                    feature.attributes.JOCOUNT = JoCount == undefined ? 0 : JoCount.JO_CNT;
                                    break;
                                case 4:
                                    JoCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                    feature.attributes.JOCOUNT = JoCount == undefined ? 0 : JoCount.JO_CNT;
                                    break;
                                case 3:
                                    JoCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                    feature.attributes.JOCOUNT = JoCount == undefined ? 0 : JoCount.JO_CNT;
                                    break;
                            }

                            if (isPercentage)
                                feature.attributes.JOCOUNT = parseFloat(feature.attributes.JOCOUNT * 100).toFixed(2);

                            var count = feature.attributes.JOCOUNT;
                            var _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                            var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                            $rootScope.map.graphics.add(graphic);
                            var textSymbol;
                            if (isPercentage)
                                textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            else
                                textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                            $rootScope.map.graphics.add(textGraphic);
                        });
                    }
                });
            };

            service.GetNumberOfNonJordanians = function (layerId, isPercentage, callback) {

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
                    },
                    function (features, callback) {
                        serviceBase.HttpRequest.Save({
                            url: '/statisticalreports/GetNonJordaniansCounts',
                            data: {layerId: layerId, isPercentage: isPercentage}
                        }, function (response) {
                            callback(response.error, features, response.list);
                        });
                    }
                ], function (err, features, list) {
                    if (err)
                        serviceBase.showErrorNotification(service.StatisticalReportsText, err);
                    else {
                        var max = _.max(list, function (item) {
                            return item.OTH_CNT;
                        }).OTH_CNT;

                        if (isPercentage) {
                            max = parseFloat(max * 100).toFixed(2);
                        }

                        var min = parseInt(max / 8);

                        var statisticalArr = Array.apply(null, {length: 8}).map(function (_, index) {
                            return parseInt(index + 1) * min;
                        });

                        service.StatisticalLegendCreator(statisticalArr);
                        $.each(features, function (index, feature) {
                            var OthCount;
                            switch (layerId) {
                                case 8:
                                    OthCount = _.findWhere(list, {CODE: feature.attributes.GOVCODE});
                                    feature.attributes.OTH_COUNT = OthCount == undefined ? 0 : OthCount.OTH_CNT;
                                    break;
                                case 7:
                                    OthCount = _.findWhere(list, {CODE: feature.attributes.DISTCODE});
                                    feature.attributes.OTH_COUNT = OthCount == undefined ? 0 : OthCount.OTH_CNT;
                                    break;
                                case 6:
                                    OthCount = _.findWhere(list, {CODE: feature.attributes.SUBDISTCODE});
                                    feature.attributes.OTH_COUNT = OthCount == undefined ? 0 : OthCount.OTH_CNT;
                                    break;
                                case 5:
                                    OthCount = _.findWhere(list, {CODE: feature.attributes.LOCCODE});
                                    feature.attributes.OTH_COUNT = OthCount == undefined ? 0 : OthCount.OTH_CNT;
                                    break;
                                case 4:
                                    OthCount = _.findWhere(list, {CODE: feature.attributes.AREACODE});
                                    feature.attributes.OTH_COUNT = OthCount == undefined ? 0 : OthCount.OTH_CNT;
                                    break;
                                case 3:
                                    OthCount = _.findWhere(list, {CODE: feature.attributes.NHCODE});
                                    feature.attributes.OTH_COUNT = OthCount == undefined ? 0 : OthCount.OTH_CNT;
                                    break;
                            }

                            if (isPercentage)
                                feature.attributes.OTH_COUNT = parseFloat(feature.attributes.OTH_COUNT * 100).toFixed(2);

                            var count = feature.attributes.OTH_COUNT;
                            var _symbol = service.GetStatisticalReportsSymbology(count, statisticalArr);

                            var graphic = esriLib.CreateGraphic(feature.geometry, _symbol, feature.attributes, null);
                            $rootScope.map.graphics.add(graphic);
                            var textSymbol;
                            if (isPercentage)
                                textSymbol = new esriLib.CreateTextSymbol(count + "%", [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            else
                                textSymbol = new esriLib.CreateTextSymbol(count, [255, 255, 0, 255], "8pt", "Droid Arabic Naskh", esriLib.GetFontWeight('WEIGHT_BOLD'));
                            var textGraphic = new esriLib.CreateGraphic(feature.geometry.getExtent().getCenter(), textSymbol);
                            $rootScope.map.graphics.add(textGraphic);
                        });
                    }
                });
            };

            service.initialize();

            return service;

        }]);
