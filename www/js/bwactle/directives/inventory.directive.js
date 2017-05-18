/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .directive("inventory", inventoryDirective);

    inventoryDirective.$inject = ["$rootScope"];

    function inventoryDirective($rootScope) {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "templates/inventory.html",
            controller: "Inventory",
            controllerAs: "I",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {

        }
    }
}());