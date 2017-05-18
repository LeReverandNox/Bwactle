/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("App", AppController);

    AppController.$inject = ["$rootScope", "$scope", "$ionicPopup", "$state", "userService"];

    function AppController($rootScope, $scope, $ionicPopup ,$state, userService) {
        var A = this;

        A.logout = function () {
            userService.logout(function (err) {
                if (err) {
                    return $ionicPopup.alert({
                        title: "Uh-oh... something went wrong !",
                        template: err
                    });
                }
                return $ionicPopup.alert({
                    title: "Info",
                    template: "You are now disconnected.\nSee you 'round"
                }).then(function () {
                    $rootScope.$emit('stopEmitters');
                    $state.go('login');
                });

            });
        };
    }
}());
