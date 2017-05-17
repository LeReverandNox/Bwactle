/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Players", PlayersController);

    PlayersController.$inject = ["$rootScope", "$scope", "$state", "gameService", "userService"];

    function PlayersController($rootScope, $scope, $state, gameService, userService) {
        if (!userService.isConnected) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            $state.go("login");
        }
        var P = this;

        P.players = gameService.players;
    }
}());
