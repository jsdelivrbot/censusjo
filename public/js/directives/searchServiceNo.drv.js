/**
 * Created by mmajali on 11/10/16.
 */
'use strict';
angular.module('gisapp')
    .directive('searchServiceNo', function(){
       var ctrl = function($rootScope, $scope, $timeout, serviceData){
           $rootScope.$on('serviceListChanged', function (event, data) {
               $scope.lstNoServices = data;
               $scope.fromNumber = 0;
               $scope.toNumber = 0;

               $timeout(function () {
                   $("#ddlServicesNoTypes").select2({
                       placeholder: $rootScope.getField('ServiceTypesText'),
                       dir: $rootScope.getField('dir'),
                       templateResult: getServicesIcons,
                       templateSelection: getServicesIcons
                   });
               }, 500);
           });

           $rootScope.$on('resetAll', function(event, data){
             $scope.srvNoSeclectedLayerId = undefined;
             $scope.srvNoSelectedServiceCode = undefined;
             $scope.fromNumber = 0;
             $scope.toNumber = 0;
             $timeout(function(){
                 $("#srvNoLayer").niceSelect('update');
                 $("#ddlServicesNoTypes").val([]).trigger('change');
             }, 150);
           });

           $rootScope.$on('languageChanged', function (event, data) {
               $timeout(function () {
                   $('#srvNoLayer').niceSelect('update');
                   $("#ddlServicesNoTypes").select2({
                       placeholder: $rootScope.getField('ServiceTypesText'),
                       templateResult: getServicesIcons,
                       templateSelection: getServicesIcons,
                       dir: $rootScope.getField('dir')
                   });
               }, 500);
           });

           $rootScope.$on('layersForServices', function (event, data) {
               $scope.lstNoServicesLayers = data;
               $timeout(function () {
                   $('#srvNoLayer').niceSelect();
               }, 500);
           });

           $scope.invalid = {
               isNoServiceLayerSelected: false,
               isNoServiceSelected: false
           };

           $scope.onServiceNoLayerChanged = function(){
               if($scope.srvNoSeclectedLayerId){
                   $scope.invalid.isNoServiceLayerSelected = false;
               }
           };

           $scope.onServiceNoServiceChanged = function(){
               if($scope.srvNoSelectedServiceCode){
                   $scope.invalid.isNoServiceSelected = false;
               }
           };

           $scope.searchNoOfServices = function(){
               if (!$scope.srvNoSeclectedLayerId)
                   $scope.invalid.isNoServiceLayerSelected = true;
               else
                   $scope.invalid.isNoServiceLayerSelected = false;

               if(!$scope.srvNoSelectedServiceCode)
                   $scope.invalid.isNoServiceSelected = true;
               else
                   $scope.invalid.isNoServiceSelected = false;

               if($scope.invalid.isNoServiceSelected || $scope.isNoServiceLayerSelected)
                   return;

               var SearchObj = {};
               SearchObj.LayerId = $scope.srvNoSeclectedLayerId;
               SearchObj.ServiceId = $scope.srvNoSelectedServiceCode;
               SearchObj.fromNumber = $scope.fromNumber;
               SearchObj.toNumber = $scope.toNumber;
               $scope.ServicesResult = [];
               serviceData.getServicesNo(SearchObj)
                   .then(function(result){
                      $rootScope.$broadcast('servicesNoLoaded', {result: result, layerId: $scope.srvNoSeclectedLayerId});
                   });
           };
       };

       return {
           restrict: 'EA',
           templateUrl: 'views/tpl/searchNoServices.tpl.html',
           controller: ctrl
       }
    });
