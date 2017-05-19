/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .directive("dpad", dpadDirective);

    dpadDirective.$inject = ["$rootScope", "gameService"];

    function dpadDirective($rootScope, gameService) {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "templates/dpad.html",
            controller: "Dpad",
            controllerAs: "D",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
        }
    }
}());