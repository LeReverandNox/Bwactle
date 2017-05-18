/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Inventory", InventoryController);

    InventoryController.$inject = ["$rootScope", "$scope", "$state", "gameService"];

    function InventoryController($rootScope, $scope, $state, gameService) {
        var I = this;
    }
}());
