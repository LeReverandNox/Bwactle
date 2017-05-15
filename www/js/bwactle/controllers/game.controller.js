/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Game", GameController);

    GameController.$inject = ["$rootScope", "$scope", "$state", "userService", "$ionicHistory"];

    function GameController($rootScope, $scope, $state, userService, $ionicHistory) {
        if (!userService.isConnected) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            $state.go("login");
            return true;
        }
    }
}());
