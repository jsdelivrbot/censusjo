'use strict'

angular.module('gisapp')
    .factory('esriLib', ['$rootScope', '$q', 'serviceBase', 'blockUI', 'esriLoader',
        function ($rootScope, $q, serviceBase, blockUI, esriLoader) {

            var service = {};

            esriLoader.require([
                "esri/map",
                "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/layers/FeatureLayer",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/symbols/TextSymbol",
                "esri/symbols/Font",
                "esri/renderers/SimpleRenderer",
                "esri/layers/LabelLayer",
                "esri/Color",
                "esri/layers/ImageParameters",
                "esri/virtualearth/VETiledLayer",
                "esri/tasks/RelationshipQuery",
                "esri/tasks/QueryTask",
                "esri/tasks/query",
                "esri/geometry/webMercatorUtils",
                "esri/tasks/BufferParameters",
                "esri/InfoTemplate",
                "esri/graphic",
                "esri/layers/GraphicsLayer",
                "esri/geometry/Point",
                "esri/graphicsUtils",
                "esri/geometry/Circle",
                "esri/tasks/ClassBreaksDefinition",
                "esri/tasks/AlgorithmicColorRamp",
                "esri/tasks/GenerateRendererParameters",
                "esri/tasks/GenerateRendererTask",
                "esri/renderers/smartMapping",
                "esri/dijit/Legend",
                "dijit/TooltipDialog",
                "dijit/popup",
                "dojo/dom-style",
                "esri/dijit/ColorPicker",
                "esri/arcgis/utils",
                "esri/dijit/Print",
                "esri/tasks/PrintTemplate",
                "esri/tasks/PrintTask",
                "esri/tasks/PrintParameters",
                "dojo/dom",
                "dojo/_base/array",
                "dojo/parser",
                "esri/tasks/find",
                "esri/tasks/FindTask",
                "esri/tasks/FindParameters",
                "esri/toolbars/draw",
                "esri/dijit/Measurement",
            ], function (map, ArcGISDynamicMapServiceLayer, FeatureLayer, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, PictureMarkerSymbol,
                         TextSymbol, Font, SimpleRenderer, LabelLayer, Color, ImageParameters, VETiledLayer, RelationshipQuery, QueryTask, Query, webMercatorUtils,
                         BufferParameters, InfoTemplate, Graphic, GraphicsLayer, Point, GraphicsUtils, Circle, ClassBreaksDefinition,
                         AlgorithmicColorRamp, GenerateRendererParameters, GenerateRendererTask, smartMapping, Legend,
                         TooltipDialog, dijitPopup, domStyle, ColorPicker, arcgisUtils, Print, PrintTemplate, PrintTask, PrintParameters,
                         dom, arrayUtils, parser, Find, FindTask, FindParameters, Draw, Measurement) {

                service.legendObj;

                service.createMeasurementTools = function(dvId){
                    var measurement = new Measurement({
                        defaultAreaUnit: esri.Units.SQUARE_MILES,
                        defaultLengthUnit: esri.Units.KILOMETERS,
                        map: $rootScope.map
                    }, dom.byId(dvId));
                    measurement.startup();
                };


                service.CreateFeatureLayerInstance = function (_layerId, _index, _outFields, _infoTemplate) {
                    var _featureLayer = new FeatureLayer(GenerateMapServerUrl(_index),
                        {
                            id: _layerId,
                            outFields: _outFields,
                            infoTemplate: _infoTemplate
                        });
                    return _featureLayer;
                };

                service.createColorPicker = function (dvId, initialColor) {
                    var colorPicker = new esri.dijit.ColorPicker({}, dvId);
                    return colorPicker;
                };

                service.generateColor = function (colorCode) {
                    return new Color(colorCode);
                };

                service.createPrintDijit = function (printTitle) {
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
                    var templates = arrayUtils.map(layouts, function (lo) {
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

                };

                service.generatePrintTask = function(layout, format, callback){
                    var url = GetPrintTaskUrl();
                    var printTask = new esri.tasks.PrintTask(url);
                    var template = new PrintTemplate();
                    template.layout = layout;
                    template.format = format;
                    template.layoutOptions = {
                        "scalebarUnit": "Kilometers",
                        "copyrightText": "",
                        "showAttribution": false
                    };
                    template.preserveScale = true;
                    var params = new  esri.tasks.PrintParameters();
                    params.map = $rootScope.map;
                    params.template = template;

                    printTask.execute(params, callback);
                };

                service.CreateLegend = function (map, layer, field) {
                    if (service.legendObj) {
                        service.legendObj.destroy();
                        domConstruct.destroy(dom.byId("legendDiv"));
                    }

                    var legendDiv = domConstruct.create("div", {
                        id: "legendDiv"
                    }, dom.byId("legendWrapper"));

                    service.legendObj = new Legend({
                        map: map,
                        layerInfos: [{
                            layer: layer,
                            title: "Census Attribute: " + field
                        }]
                    }, legendDiv);
                    legend.startup();
                }

                service.CreateFeatureLayerByCollection = function (_collection, _layerId, _infoTemplate) {
                    var _featureLayer = new FeatureLayer(_collection, {
                        id: _layerId,
                        infoTemplate: _infoTemplate,
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: "*",
                        opacity: 0.8
                    });

                    return _featureLayer;
                };

                service.CreateDynamicLayerInstance = function () {
                    var strUrl = "";
                    if (portNo)
                        strUrl = "http://{ServerIP}:{portNo}/arcgis/rest/services/{MapServerName}/MapServer".format({
                            ServerIP: ServerIP,
                            portNo: portNo,
                            MapServerName: BaseMap
                        });
                    else {
                        strUrl = "http://{ServerIP}/arcgis/rest/services/{MapServerName}/MapServer".format({
                            ServerIP: ServerIP,
                            MapServerName: BaseMap
                        });
                    }
                    var _dynamicLayer = new ArcGISDynamicMapServiceLayer(strUrl);
                    return _dynamicLayer;
                };

                service.CreateFillRenderer = function (simpleLineStyle, simpleLineColor, simpleLineWidth, simpleFillStyle, fillColor) {
                    var sls = new SimpleLineSymbol(GetSimpleLineSymbolStyle(simpleLineStyle), new Color(simpleLineColor), simpleLineWidth);
                    var FillSymbol = new SimpleFillSymbol(GetSimpleFillSymbolStyle(simpleFillStyle), sls, new Color(fillColor));
                    var Renderer = new SimpleRenderer(FillSymbol);

                    return Renderer;
                };

                service.GetSimpleRenderer = function (symbol) {
                    return new SimpleRenderer(symbol);
                };

                service.GetSimpleFillSymbol = function (SimpleFillStyle, SimpleLineStyle, simpleLineColor, lineWeight, fillColor) {
                    var _fillSymbol = //new SimpleFillSymbol().setColor(null).outline.setColor("blue");
                        new SimpleFillSymbol(
                            GetSimpleFillSymbolStyle(SimpleFillStyle),
                            new SimpleLineSymbol(
                                GetSimpleLineSymbolStyle(SimpleLineStyle),
                                new Color(simpleLineColor), lineWeight
                            ),
                            new Color(fillColor)
                        );
                    return _fillSymbol;
                };

                service.GetInfoTemplate = function (title, content) {
                    var infoTemplate = new esri.InfoTemplate(title, content);
                    return infoTemplate;
                };

                service.CreateTooltipDialog = function () {
                    var dialog = new dijit.TooltipDialog({
                        id: 'tooltipDialog',
                        style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
                    });
                    return dialog;
                };

                service.openDialog = function(dialog, evt){
                    dijitPopup.open({
                        popup: dialog,
                        x: evt.pageX,
                        y: evt.pageY
                    });
                };

                service.closeDialog = function(dialog){
                  dijitPopup.close(dialog);
                };

                service.CreateSimpleLineRenderer = function (simpleLineStyle, simpleLineColor, simpleLineWidth) {
                    var sls = new SimpleLineSymbol(GetSimpleLineSymbolStyle(simpleLineStyle), new Color(simpleLineColor), simpleLineWidth);
                    var Renderer = new SimpleRenderer(sls);
                    return Renderer;
                };

                service.GetSimpleLineSymbol = function (SimpleLineStyle, simpleLineColor, simpleLineWidth) {
                    var sls = new SimpleLineSymbol(GetSimpleLineSymbolStyle(SimpleLineStyle), new Color(simpleLineColor), simpleLineWidth);
                    return sls;
                };

                service.CreatePictureSymbolRenderer = function (imgUrl, imgType, imgWidth, imgHeight) {
                    var symbol = new PictureMarkerSymbol({
                        "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS",
                        "url": imgUrl,
                        "contentType": imgType, "width": imgWidth, "height": imgHeight
                    });
                    return new SimpleRenderer(symbol);
                }

                service.GetPictureMarkerSymbol = function (imgUrl, imgType, imgWidth, imgHeight) {
                    var symbol = new PictureMarkerSymbol({
                        "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS",
                        "url": imgUrl,
                        "contentType": imgType, "width": imgWidth, "height": imgHeight
                    });
                    return symbol;
                };

                service.GetSimpleMarkerSymbol = function (MarkerStyle, size, simpleLineStyle, simpleLineColor,
                                                          simpleLineWidth, markerColor) {
                    var symbol = new SimpleMarkerSymbol(
                        GetSimpleMarkerSymbolStyle(MarkerStyle),
                        size,
                        service.GetSimpleLineSymbol(SimpleLineStyle, simpleLineColor, simpleLineWidth),
                        new Color(markerColor));
                    return symbol;
                };

                service.GetSimpleMarkerSymbolEmptyObj = function () {
                    return new SimpleMarkerSymbol();
                };

                service.CreateTextSymbol = function (text, color, fontSize, fontFamily, FontWeight) {
                    var textSymbol = new esri.symbol.TextSymbol(text).setColor(new Color(color))
                        .setFont(new Font(fontSize, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, FontWeight, fontFamily))
                        .setAlign(esri.symbol.TextSymbol.ALIGN_MIDDLE);
                    return textSymbol;
                };

                service.CreateLabelLayer = function (TextSymbolColor, fontSize, fontFamily, FontWeight, labelId) {
                    var _textSymbol = new TextSymbol().setColor(new Color(TextSymbolColor));
                    _textSymbol.font.setSize(fontSize);
                    _textSymbol.font.setFamily(fontFamily);
                    _textSymbol.font.setWeight(FontWeight);
                    var _labelRenderer = new SimpleRenderer(_textSymbol);
                    var _labelLayer = new LabelLayer({id: labelId});

                    return {
                        labelRenderer: _labelRenderer,
                        LabelLayer: _labelLayer
                    }
                };

                service.CreateGraphic = function (_geometry, _symbol, _attr, _infoTemplate) {
                    var graphic = new esri.Graphic(_geometry, _symbol, _attr, _infoTemplate);
                    return graphic;
                };

                service.CreateGraphicsLayer = function (id) {
                    var gl = new esri.layers.GraphicsLayer({id: id});
                    return gl;
                };

                service.GetGraphicsExtent = function (graphics) {
                    var extent = esri.graphicsExtent(graphics);
                    return extent;
                };

                service.CreatePoint = function (xloc, yloc, spatialReference) {
                    var point = new esri.geometry.Point(xloc, yloc);
                    return point;
                };

                service.GetFontWeight = function (weight) {
                    switch (weight) {
                        case 'WEIGHT_BOLD':
                            return Font.WEIGHT_BOLD;
                            break;
                    }
                };

                service.ReturnBufferCircle = function (evt, radius) {
                    return new esri.geometry.Circle({
                        center: evt.mapPoint,
                        geodesic: true,
                        radius: radius,
                        radiusUnit: esri.Units.KILOMETERS
                    });
                };

                function GetSimpleMarkerSymbolStyle(style) {
                    switch (style) {
                        case 'STYLE_CIRCLE':
                            return SimpleMarkerSymbol.STYLE_CIRCLE;
                            break;
                        case 'STYLE_CROSS':
                            return SimpleMarkerSymbol.STYLE_CROSS;
                            break;
                        case 'STYLE_DIAMOND':
                            return SimpleMarkerSymbol.STYLE_DIAMOND;
                            break;
                        case 'STYLE_PATH':
                            return SimpleMarkerSymbol.STYLE_PATH;
                            break;
                        case 'STYLE_SQUARE':
                            return SimpleMarkerSymbol.STYLE_SQUARE;
                        case 'STYLE_X':
                            return SimpleMarkerSymbol.STYLE_X;
                            break;
                    }
                };

                function GetSimpleLineSymbolStyle(style) {
                    switch (style) {
                        case 'STYLE_DASH':
                            return SimpleLineSymbol.STYLE_DASH;
                            break;
                        case 'STYLE_DASHDOT':
                            return SimpleLineSymbol.STYLE_DASHDOT;
                            break;
                        case 'STYLE_DASHDOTDOT':
                            return SimpleLineSymbol.STYLE_DASHDOTDOT;
                            break;
                        case 'STYLE_DOT':
                            return SimpleLineSymbol.STYLE_DOT;
                            break;
                        case 'STYLE_LONGDASH':
                            return SimpleLineSymbol.STYLE_LONGDASH;
                            break;
                        case 'STYLE_LONGDASHDOT':
                            return SimpleLineSymbol.STYLE_LONGDASHDOT;
                            break;
                        case 'STYLE_NULL':
                            return SimpleLineSymbol.STYLE_NULL;
                            break;
                        case 'STYLE_SHORTDASH':
                            return SimpleLineSymbol.STYLE_SHORTDASH;
                            break;
                        case 'STYLE_SHORTDASHDOT':
                            return SimpleLineSymbol.STYLE_SHORTDASHDOT;
                            break;
                        case 'STYLE_SHORTDASHDOTDOT':
                            return SimpleLineSymbol.STYLE_SHORTDASHDOTDOT;
                            break;
                        case 'STYLE_SHORTDOT':
                            return SimpleLineSymbol.STYLE_SHORTDOT;
                            break;
                        case 'STYLE_SOLID':
                            return SimpleLineSymbol.STYLE_SOLID;
                            break;
                    }
                };

                function GetSimpleFillSymbolStyle(style) {
                    switch (style) {
                        case 'STYLE_BACKWARD_DIAGONAL':
                            return SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL;
                            break;
                        case 'STYLE_CROSS':
                            return SimpleFillSymbol.STYLE_CROSS;
                            break;
                        case 'STYLE_DIAGONAL_CROSS':
                            return SimpleFillSymbol.STYLE_DIAGONAL_CROSS;
                            break;
                        case 'STYLE_FORWARD_DIAGONAL':
                            return SimpleFillSymbol.STYLE_FORWARD_DIAGONAL;
                            break;
                        case 'STYLE_HORIZONTAL':
                            return SimpleFillSymbol.STYLE_HORIZONTAL;
                            break;
                        case 'STYLE_NULL':
                            return SimpleFillSymbol.STYLE_NULL;
                            break;
                        case 'STYLE_SOLID':
                            return SimpleFillSymbol.STYLE_SOLID;
                            break;
                        case 'STYLE_VERTICAL':
                            return SimpleFillSymbol.STYLE_VERTICAL;
                            break;
                    }
                };

                service.ConvertXYToLngLat = function (pnt) {
                    var deferredService = $q.defer();
                    var geometryService = new esri.tasks.GeometryService(GetGeometryServiceUrl());
                    var PrjParams = new esri.tasks.ProjectParameters();
                    PrjParams.geometries = [pnt];
                    PrjParams.outSR = new esri.SpatialReference({wkid: 4326});
                    geometryService.project(PrjParams, function (output) {
                        deferredService.resolve(output);
                    });
                    return deferredService.promise;
                };

                service.CreateSmartMapping = function (layer, field) {
                    esri.renderers.smartMapping.createClassedColorRenderer({
                        layer: layer,
                        field: field,
                        basemap: $rootScope.map.getBasemap(),
                        classificationMethod: "natural-breaks",
                        numClasses: 8
                    }).then(function (response) {
                        layer.setRenderer(response.renderer);
                        layer.redraw();
                        service.CreateLegend($rootScope.map, layer, field);
                    });
                };

                service.defineClassBreakDefinition = function (indicatorFeatureLayer, fieldName, fromColor, toColor, layerIndex) {
                    service.indicatorFeatureLayer = indicatorFeatureLayer;
                    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_SOLID,
                            new Color([0, 0, 0]),
                            0.5
                        ),
                        null
                    );

                    var classDef = ClassBreaksDefinition();
                    classDef.classificationField = fieldName;
                    classDef.classificationMethod = "natural-breaks";
                    classDef.breakCount = 5;

                    var colorRamp = new AlgorithmicColorRamp();
                    colorRamp.fromColor = new Color.fromHex(fromColor);
                    colorRamp.toColor = new Color.fromHex(toColor);
                    colorRamp.algorithm = "hsv"; // options are:  "cie-lab", "hsv", "lab-lch"

                    classDef.baseSymbol = sfs;
                    classDef.colorRamp = colorRamp;

                    var params = new GenerateRendererParameters();
                    params.classificationDefinition = classDef;
                    params.where = "1 = 1";
                    var generateRenderer = new GenerateRendererTask(GenerateMapServerUrl(layerIndex));
                    generateRenderer.execute(params, applyRenderer, errorHandler);
                };

                function applyRenderer(renderer){
                    service.indicatorFeatureLayer.setRenderer(renderer);
                    service.indicatorFeatureLayer.redraw();
                }

                function errorHandler(err){
                    console.log('error: ', err);
                }

                service.InvokeRelationshipQuery = function () {
                    var relatedQuery = new RelationshipQuery();
                };

                service.InvokeFindTask = function(ftOpts, showBlockUI, cbQuery){
                    var deferredFindTask = $q.defer();

                    if (showBlockUI)
                        blockUI.start();

                    var findTask = new FindTask(ftOpts.url);
                    var params = new FindParameters();
                    params.layerIds = ftOpts.layersIds;
                    params.searchFields = ftOpts.searchFields;
                    params.searchText = ftOpts.searchText;
                    params.returnGeometry = ftOpts.returnGeometry;

                    findTask.on('error', function(msg){
                        blockUI.stop();
                        serviceBase.showErrorNotification($rootScope.getField('QueryTaskTitle'), $rootScope.getField('QueryTaskFailedMsg'));
                    });

                    findTask.execute(params, function(response){
                        blockUI.stop();
                        var result = {};
                        result.cbFN = cbQuery;
                        result.response = response;
                        deferredFindTask.resolve(result);
                    });

                    return deferredFindTask.promise;
                };

                service.InvokeQueryTask = function (qtOpts, showBlockUI, cbQuery) {
                    var deferredQueryTask = $q.defer();

                    if (showBlockUI)
                        blockUI.start();
                    var _query = new Query();
                    _query.where = qtOpts.strWhere;
                    _query.returnGeometry = qtOpts.returnGeometry;
                    _query.outFields = qtOpts.outFields;

                    var _queryTask = new QueryTask(qtOpts.url);
                    _queryTask.on('error', function (msg) {
                        blockUI.stop();
                        serviceBase.showErrorNotification($rootScope.getField('QueryTaskTitle'), $rootScope.getField('QueryTaskFailedMsg'));
                    });

                    _queryTask.execute(_query, function (response) {
                        var result = {};
                        blockUI.stop();
                        result.cbFN = cbQuery;
                        result.response = response;
                        deferredQueryTask.resolve(result);
                    });

                    return deferredQueryTask.promise;
                };

                service.createDrawToolbar = function(map){
                    var toolbar = new Draw(map);
                    return toolbar;
                };

                service.returnDrawingTools = function(){
                    return [Draw.LINE, Draw.RECTANGLE,Draw.TRIANGLE, Draw.POLYGON, Draw.CIRCLE];
                }

            });

            return service;
        }]);
