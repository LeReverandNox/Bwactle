/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .directive("playersList", playersListDirective);

    playersListDirective.$inject = ["$rootScope"];

    function playersListDirective($rootScope) {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "/templates/players-list.html",
            controller: "Players",
            controllerAs: "P",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {

        }
    }
}());