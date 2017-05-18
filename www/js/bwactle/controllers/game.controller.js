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

        $scope.messageType = '';
        $scope.messageContent = '';

        $rootScope.$on('updateMsg', function (e, msg) {
            console.log(msg);
            if (msg.content) {
                $scope.messageContent = msg.content;
            }
            if (msg.type) {
                switch (msg.type) {
                case 0:
                    $scope.messageType = 'Info - ';
                    break;
                case 1:
                    $scope.messageType = 'API Error - ';
                    break;
                case 2:
                    $scope.messageType = 'Error - ';
                    break;
                case 3:
                    $scope.messageType = 'Fatal ERROR - ';
                    break;
                default:
                    break;
                }
            }
        });

        G.touch = function (e) {
            var $el = angular.element(e.target);
            switch ($el.attr('action')) {
                case 'attack':
                    attack();
                    break;
                case 'unequip':
                    unequip();
                    break;
                case 'pick':
                    pick();
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

        function pick() {
            $rootScope.$emit('pick');
        };
    }
}());
