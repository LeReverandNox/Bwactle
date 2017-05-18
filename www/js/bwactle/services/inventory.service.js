/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .factory("inventoryService", inventoryService);

    inventoryService.$inject = ["socketService"];

    function inventoryService(socketService) {
        var service = {
        };

        return service;
    }
}());