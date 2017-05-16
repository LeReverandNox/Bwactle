/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Game", GameController);

    GameController.$inject = ["$rootScope", "$scope", "$state", "userService", "$ionicHistory", "gameService"];

    function GameController($rootScope, $scope, $state, userService, $ionicHistory, gameService) {
        if (!userService.isConnected) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            $state.go("login");
        }

        $rootScope.$on('startGame', function (e, player) {
            gameService.setPlayer(player);
            gameService.init();
        });
    }
}());
