/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Dpad", DpadController);

    DpadController.$inject = ["$rootScope", "$scope", "$state", "userService", "$ionicHistory", "gameService"];

    function DpadController($rootScope, $scope, $state, userService, $ionicHistory, gameService) {
        var D = this;

        D.touchArrow = function (e) {
            var $el = angular.element(e.target);
            var direction = $el.attr('direction');

            if(direction) {
                move(direction);
            }
        };

        function move(direction) {
            $rootScope.$emit('move', direction);
        }
    }
}());
