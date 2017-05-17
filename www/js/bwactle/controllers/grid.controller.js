/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Grid", GridController);

    GridController.$inject = ["$rootScope", "$scope", "$state", "gameService"];

    function GridController($rootScope, $scope, $state, gameService) {
        var G = this;

    }
}());
