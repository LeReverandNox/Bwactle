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
            gameService.startListeners();
            $rootScope.$emit('startEmitters');
            gameService.setPlayer(player);
            gameService.init();
        });

        var G = this;

        G.touch = function (e) {
            var $el = angular.element(e.target);
            switch ($el.attr('action')) {
                case 'attack':
                    attack();
                    break;
                case 'unequip':
                    unequip();
                    break;
                default:
                    break;
            }
        };

        function attack() {
            $rootScope.$emit('attack');
        };

        function unequip() {
            $rootScope.$emit('unequip');
        };

    }
}());
