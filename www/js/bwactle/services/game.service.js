/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .factory("gameService", gameService);

    gameService.$inject = ["socketFactory"];

    function gameService(socketFactory) {
        var service = {
            // Attributes
            worldGrid: [],
            grid: [],
            player: null,
            //Methods
            init: init,
            // Getters / Setters
            setPlayer: setPlayer
        };

        return service;

        function init(cb) {
            console.log('On va init le jeu!!!');
            console.log(this.player);
        }

        function setPlayer(player) {
            this.player = player;
            return this.player;
        }
    }
}());