'use strict'

angular.module('gisapp')
  .factory('esriLoader', ['$q', '$rootScope',
    function($q, $rootScope){

    var service = {};

    // load the Esri ArcGIS API for JavaScript
    service.loadEsri = function(options){
      var deferred = $q.defer();
      var opts = options || {};

      if(service.isLoaded()){
        deferred.reject('ESRI API is already loaded.');
        return defered.promise;
      }

      // create script object to be loaded
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = opts.url || window.location.protocol + '//js.arcgis.com/3.14';

      script.onload = function(){ deferred.resolve(window.require); };
      document.body.appendChild(script);

      return deferred.promise;
    }

    service.isLoaded = function(){
      return typeof window.require !== 'undefined';
    }

    service.require = function(moduleName, callback){
      var deferred = $q.defer();

      if(!service.isLoaded()){
        deferred.reject('Trying to call esriLib.require(), but ESRI ArcGIS API has not been loaded yet!');
        return defered.promise;
      }

      if(typeof moduleName === 'string'){
        require([moduleName], function(module){
          // check if callback exits, and execute if it does
          if(callback && typeof callback === 'function')
            callback(module);

          deferred.resolve(module);
          $rootScope.$broadcast('libLoaded', true);
        });
      }
      else if(moduleName instanceof Array){
        require(moduleName, function(){
          var args = Array.prototype.slice.call(arguments);

          if(callback && typeof callback === 'function'){
            callback.apply(this, args);
          }
          $rootScope.$broadcast('libLoaded', true);
          deferred.resolve(args);
        });
      }
      else{
        deferred.reject('An Array<string> or String is required to load modules.');
      }

      return deferred.promise;
    }

    return service;

  }]);
