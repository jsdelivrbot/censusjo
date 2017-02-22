'use strict'

angular.module('gisapp')
	.factory('serviceBase', ['$rootScope', '$resource', 'toastr', 'toastrConfig',
		function($rootScope, $resource, toastr, toastrConfig){
			var baseService = {};
			baseService.HttpRequest = {};

			toastrConfig.closeButton = true;
			toastrConfig.progressBar = true;
			toastrConfig.newestOnTop = true;
			toastrConfig.positionClass = 'toast-top-center';
			//toastrConfig.showDuration = 0;
			//toastrConfig.hideDuration = 1000;
			toastrConfig.showEasing = "easeOutBounce";
			toastrConfig.hideEasing = "easeOutBounce";
			toastrConfig.maxOpened = 1;
			toastrConfig.preventOpenDuplicates= true;
			toastrConfig.timeOut = 0;

			baseService.showSuccessNotification = function(title, msg){
	      if(title)
	        toastr.success(msg, title);
	      else {
	        toastr.success(msg);
	      }
	    }

			baseService.showErrorNotification = function(title, msg){
	      if(title)
	        toastr.error(msg, title);
	      else {
	        toastr.error(msg);
	      }
	    }

	    baseService.showWarningNotification = function(title, msg){
	      if(title)
	        toastr.warning(msg, title);
	      else {
	        toastr.warning(msg);
	      }
	    }

	    baseService.showInfoNotification = function(title, msg){
	      if(title)
	        toastr.info(msg, title);
	      else {
	        toastr.info(msg);
	      }
	    }

			baseService.HttpRequest.Get = function(Obj, callback){
				var resourceObj = ConstructResource(Obj.url);
				var result = resourceObj.get(Obj.data, function(){
					if(result.error){
						baseService.showErrorNotification('Server error', result.error);

					}
					callback(result);
				}, function(error){
					baseService.showErrorNotification('Http', error.data);
				});
			};

			baseService.HttpRequest.Query = function(Obj, callback){
				var resourceObj = ConstructResource(Obj.url);
				Obj.isArray = false;
				var result = resourceObj.query(Obj.data, function(){
					if(result.error){
						baseService.showErrorNotification('Server error', result.error);

					}
					callback(result);
				},function(error){
					baseService.showErrorNotification('Http', error.data);
				});
			};

			baseService.HttpRequest.Save = function(Obj, callback){
					var resourceObj = ConstructResource(Obj.url);
					resourceObj.data = Obj.data;
					var result = resourceObj.save(Obj.data).$promise.then(function(res){
						if(res.error){
							baseService.showErrorNotification('Server error', result.error);

						}
						callback(res);
					}, function(error){
						baseService.showErrorNotification('Http', error.data);
					});
			};

			var ConstructResource = function(url){
				return $resource(url);
			}

			return baseService;
		}])
		.factory('HttpRequest', ['$resource', function($resource, url){
			return $resource(url);
		}]);
