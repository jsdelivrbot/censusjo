'use strict'

angular.module('gisapp', ['ui.router', 'ngTagsInput', 'ngResource', 'ngCookies','pascalprecht.translate',
'ngAnimate', 'ui.bootstrap', 'toastr', 'blockUI', 'ui.grid', 'rt.select2', 'color.picker', 'ui.grid.selection',
'ui.grid.exporter'])
  .config(['$stateProvider', '$urlRouterProvider', 'blockUIConfig', '$translateProvider',
    function($stateProvider, $urlRouterProvider, blockUIConfig, $translateProvider){

      //blockUIConfig.message = 'Please wait';
      blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="block-ui-message-container"><div class="block-ui-messageV2"><img width="100" height="100" src="img/loading-bubbles.svg" /></div></div>';

      $translateProvider
        .useStaticFilesLoader({
          prefix: '/translations/',
          suffix: '.json'
        })
        .preferredLanguage('ar')
        .useMissingTranslationHandlerLog();

      $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            if($location.$$path == "" || $location.$$path == "/") {
            	$state.go("home");
            } else {
            	$state.go("404");
            }
        });

        $stateProvider
          .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'mainCtrl',
            data: {
              hasTopMenu: true,
              hasSideMenu: true
            }
          })
          .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl',
            data: {
              hasTopMenu: false,
              hasSideMenu: false
            }
          })
          .state('users', {
            url: '/list',
            templateUrl: '/modules/users/views/list.html',
            controller: 'userCtrl',
            data: {
              hasTopMenu: false,
              hasSideMenu: false,
              requireLogin: true
            }
          })
          .state('user_edit', {
            url: '/edit',
            templateUrl: '/modules/users/views/edit.html',
            controller: 'userCtrl',
            data: {
              hasTopMenu: false,
              hasSideMenu: false
            }
          })
          .state('admin', {
            url: '/admin',
            templateUrl: '/modules/users/views/admin.html',
            controller: 'userCtrl',
            data: {
              hasTopMenu: false,
              hasSideMenu: false
            }
          })
          .state('404', {
            url: '/404',
            templateUrl: 'views/404.html',
            data: {
              hasTopMenu: false,
              hasSideMenu: false
            }
          });

    }]).run(['$rootScope', '$state','$window', '$translate',
      function($rootScope, $window, $translate){

        $rootScope.globals = {};
        $rootScope.lang = 'ar';
        $rootScope.$on("$stateChangeStart", function(event, toState, toParam, fromState, fromParam){
          $rootScope.globals.hasTopMenu = toState.data.hasTopMenu;
          $rootScope.globals.hasSideMenu = toState.data.hasSideMenu;


        });
      }]);
