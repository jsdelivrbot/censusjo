'use strict'
  angular.module('gisapp')
    .controller('userCtrl', ['$rootScope', '$scope', 'userService',
    function($rootScope, $scope, userService){
      userService.login(User, function(response){
        consol.log(response);
      });
    }]);
