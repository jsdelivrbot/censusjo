/**
 * Created by mmajali on 10/19/16.
 */
'use strict'

angular.module('gisapp')
    .directive('sidePanel', function ($rootScope, esriLib, generalservice) {
        return {
            restrict: 'E',
            templateUrl: 'views/tpl/sidepanel.tpl.html',
            controllerAs: 'sidePanel',
            controller: function ($rootScope, $scope) {

                /*
                 $scope.searchType
                 1: landmarks,
                 2: streets
                 */
                $scope.searchType = 1;
                $scope.resultNos = "(0)";

                $scope.indicatorGridOptions = {
                    enableGridMenu: true,
                    enableSorting: true,
                    exporterCsvFilename: 'indicators.csv',
                    /*exporterPdfDefaultStyle: {fontSize: 9},
                    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                    exporterPdfFooter: function ( currentPage, pageCount ) {
                        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                    },
                    exporterPdfCustomFormatter: function ( docDefinition ) {
                        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                        return docDefinition;
                    },
                    exporterPdfOrientation: 'portrait',
                    exporterPdfPageSize: 'LETTER',
                    exporterPdfMaxGridWidth: 500,
                    */
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                    columnDefs: [
                        {name: "indicator", displayName: $rootScope.getField('directorateName'), field: "GEONAME", width: '*'},
                        {name: "value",  displayName: $rootScope.getField('IndicatorVal'), field: "INDICATORVALUE", cellFilter: 'number: 2', width: '*'}
                    ],
                    data: []
                };

                $rootScope.$on('languageChanged', function (event, data) {
                                   $scope.indicatorGridOptions.columnDefs= [
                                       {name: "indicator", displayName: $rootScope.getField('directorateName'), field: "GEONAME", width: '*'},
                                       {name: "value",  displayName: $rootScope.getField('IndicatorVal'), field: "INDICATORVALUE", cellFilter: 'number: 2', width: '*'}
                                   ];
                                 });

                $scope.GetLayerAttributeAliasName = function () {
                    return $rootScope.getField('layerAttributeAliasName');
                };

                $rootScope.$on('landmarksResultsLoaded', function (event, data) {
                    $scope.searchType = 1;
                    $scope.landmarksResult = data;
                    $scope.resultNos = "({searchResultNo})".format({searchResultNo:data.length});
                    openSearchResultsPanel();
                });

                $rootScope.$on('streetsResultsLoaded', function (event, data) {
                    $scope.searchType = 2;
                    $scope.streetsResult = data;
                    $scope.resultNos = "({searchResultNo})".format({searchResultNo:data.length});
                    openSearchResultsPanel();
                });

                $rootScope.$on('layersSearchResultsLoaded', function (event, data) {
                    $scope.searchType = 3;
                    $scope.layersInfo = data;
                    $scope.resultNos = "({searchResultNo})".format({searchResultNo:data.length});
                    openSearchResultsPanel();
                });

                $rootScope.$on('servicesNoLoaded', function(event, data){
                    $scope.searchType = 4;
                    $scope.servicesNoList = _.map(data.result, function(item){
                      item.layerId = data.layerId;
                      return item;
                    });
                    $scope.resultNos = "({searchResultNo})".format({searchResultNo:data.length});
                    openSearchResultsPanel();
                });

                $scope.zoomToLayer = function(code, layerId){
                    generalservice.zoomToLayer(code, layerId);
                };

                $rootScope.$on('resetAll', function(event, data){
                   if(data){
                       $scope.clearLists();
                       $scope.indicatorGridOptions.data = [];
                       $("#indicatorChart").html('');
                       $scope.legendArray = [];
                       $scope.resultNos = "(0)";
                       if($scope.pieChart)
                        $scope.pieChart.destroy();
                   }
                });

                $scope.clearLists = function(){
                    $scope.layersInfo = [];
                    $scope.servicesNoList = [];
                    $scope.streetsResult = [];
                    $scope.landmarksResult = [];
                };

                $scope.zoomToLandMark = function (landMarkObj) {
                    var point = esriLib.CreatePoint(landMarkObj.GPS_Y, landMarkObj.GPS_X, null);
                    $rootScope.map.centerAndZoom(point, 18);
                };

                $scope.zoomToSelected = function(obj){
                    //console.log(obj);

                    var type;
                    var geometry;
                    if(obj.feature){
                        type = obj.feature.geometry.type;
                        geometry = obj.feature.geometry;
                    }else{
                        type = obj.geometry.type;
                        geometry = obj.geometry;
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

                $rootScope.$on('legendLoaded', function (event, data) {
                    $scope.legendArray = data;
                });

                $rootScope.$on('indicatorSearchSubmitted', function (event, data) {
                    $scope.indicatorGridOptions.data = data;
                });

                $scope.exportToExcel = function(){
                    var opts = {
                        sheetid: 'Sheet 1',
                        headers: false,
                        columns: [
                        {columnid: 'GEONAME', title: $rootScope.getField('directorateName')},
                        {columnid: 'INDICATORVALUE', title: $rootScope.getField('IndicatorVal')}
                    ]};
                    alasql('SELECT GEONAME, INDICATORVALUE INTO XLSX("indicators.xlsx", ?) FROM ?', [opts, $scope.indicatorGridOptions.data]);
                }

                $scope.pieChart;
                $rootScope.$on('indicatorChartDataLoaded', function (event, chartObj) {
                    try {
                        $("#indicatorChart").html('');
                        $scope.pieChart.destroy();
                    } catch (ex) {

                    }

                    var total = _.reduce(chartObj.percentage, function (mem, num) {
                        return mem + num;
                    }, 0);

                    var chartValues = _.map(chartObj.data, function (num) {
                        return (num / total) * 100;
                    });


                    $("#indicatorChart").html('');
                    var config = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: chartObj.percentage,
                                backgroundColor: chartObj.backgroundColor,
                            }],
                            labels: chartObj.labels
                        },
                        options: {
                            responsive: true,
                            legend: {
                                display: false
                            },
                            tooltips: {
                                enabled: true,
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var dataset = data.datasets[tooltipItem.datasetIndex];
                                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                            return previousValue + currentValue;
                                        });
                                        var currentValue = dataset.data[tooltipItem.index];
                                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                                        return data.labels[tooltipItem.index] + ' - ' + precentage + "%";
                                    }
                                }
                            }
                        }
                    };

                    var ctx = document.getElementById("indicatorChart").getContext("2d");
                    $scope.pieChart = new Chart(ctx, config);
                });
            }
        }
    });
