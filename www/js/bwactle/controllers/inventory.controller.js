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

        I.touchItem = function (e) {
            var $e = angular.element(e.target);
            var action = $e.attr('action');
            var itemId = $e.attr('item-id');

            switch (action) {
            case 'equip':
                $rootScope.$emit('equip', itemId);
                break;
            case 'drop':
                $rootScope.$emit('drop', itemId);
                break;
            default:
                break;
            }
        };
    }
}());
