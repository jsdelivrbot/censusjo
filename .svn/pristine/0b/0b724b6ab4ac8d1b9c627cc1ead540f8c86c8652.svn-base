'use strict'

angular.module('gisapp')
    .controller('loginCtrl', ['$rootScope', '$scope', '$state', 'generalservice', '$translate', 'authenticationService',
        function ($rootScope, $scope, $state, generalservice, $translate, authenticationService) {

            $translate(['Login', 'Cancel', 'Username', 'Password']).then(function (translations) {
                $scope.loginText = translations.Login;
                $scope.cancelText = translations.Cancel;
                $scope.usernamePlaceHolder = translations.Username;
                $scope.passwordPlaceHolder = translations.Password;
            });

            $scope.login = function () {
                var User = {
                    username: $scope.username,
                    password: $scope.password
                };
                generalservice.login(User, function (response) {
                    if (response.list.length > 0) {
                        var userObj = response.list[0];
                        if (userObj.roleId = RoleIdEnum.SuperAdmin) {
                            authenticationService.saveToken(response.token);
                            $rootScope.globals = {
                                authenticated: true
                            };
                            $state.go('home');
                        }
                    } else {

                    }
                });
            };

            $scope.cancel = function(){
                $state.go('home');
            }
        }]);
