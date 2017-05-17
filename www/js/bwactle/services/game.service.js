/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .factory("gameService", gameService);

    gameService.$inject = ["socketService", "$rootScope"];

    function gameService(socketService, $rootScope) {
        var service = {
            // Attributes
            worldGrid: [],
            grid: [],
            player: null,
            inventory: [],
            players: [],
            items: [],
            //Methods
            init: init,
            startListeners: startListeners,
            addPlayer: addPlayer,
            // Getters / Setters
            setPlayer: setPlayer
        };

        return service;

        function init(cb) {
            $rootScope.$emit('initGrid');
            $rootScope.$emit('updateGrid');
        }

        function setPlayer(player) {
            this.player = player;
            return this.player;
        }

        function startListeners() {
            socketService.onPlayerAdd(addPlayer.bind(this));
            socketService.onPlayerMove(addPlayer.bind(this));
        }

        function addPlayer(newPlayer) {
            // console.log("LE NEW PLAYER");
            // console.log(newPlayer);
            // console.log('*****');
            if (newPlayer.login === this.player.login) {
                console.log('On et mort, on respawn');
                this.player = newPlayer;
                return $rootScope.$emit('updateGrid');
            }

            var alreadyExist = this.players.find(function (player) {
                return player.login === newPlayer.login;
            });
            // console.log(alreadyExist);
            if (alreadyExist) {
                // console.log(`${newPlayer.login} est deja co, on update`);
                alreadyExist.x = newPlayer.x;
                alreadyExist.y = newPlayer.y;
                alreadyExist.lvl = newPlayer.lvl;
                alreadyExist.life = newPlayer.life;
                alreadyExist.lifeMax = newPlayer.lifeMax;
                alreadyExist.xp = newPlayer.xp;
                alreadyExist.xpLvl = newPlayer.xpLvl;
                alreadyExist.rot = newPlayer.rot;
            } else {
                this.players.push(newPlayer);
            }

            $rootScope.$emit('updateGrid');
        }
    }
}());