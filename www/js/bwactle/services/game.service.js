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
            isStarted: false,
            //Methods
            init: init,
            startListeners: startListeners,
            addPlayer: addPlayer,
            equipItem: equipItem,
            dropItem: dropItem,
            // Getters / Setters
            setPlayer: setPlayer
        };

        function init(cb) {
            // DEBUG
            this.inventory = [
                { x: null, y: null, id: "591dd08677479d743548ad45", name: "Sword", dmg: 30, type: "weapon", use: -1 },
                { x: null, y: null, id: "591db9f777479d743548a8fc", name: "Toxic Cloud", dmg: 55, type: "spell", use: 2 }
            ];
            if (!this.isStarted) {
                $rootScope.$emit('initGrid');
                $rootScope.$emit('initInventory');
            }
            $rootScope.$emit('updateGrid');
            $rootScope.$emit('updateInventory');
        }

        function setPlayer(player) {
            this.player = player;
            return this.player;
        }

        function startListeners() {
            socketService.onPlayerAdd(addPlayer.bind(this));
            socketService.onPlayerMove(addPlayer.bind(this));
            socketService.onPlayerRotation(addPlayer.bind(this));
            socketService.onPlayerHurt(addPlayer.bind(this));
            socketService.onPlayerXP(addPlayer.bind(this));
            socketService.onPlayerLevel(addPlayer.bind(this));
            socketService.onPlayerRemove(removePlayer.bind(this));
            socketService.onItemAdd(addItem.bind(this));
            socketService.onItemRemove(removeItem.bind(this));
            socketService.onInventoryAdd(addInventory.bind(this));
            socketService.onInventoryRemove(removeInventory.bind(this));
            socketService.onInventoryUpdate(addInventory.bind(this));
            // TODO: implement and display
            socketService.onMsg(function (msg) {console.log(msg)});
        }

        function equipItem(itemId) {
            socketService.equip(itemId);
        }

        function dropItem(itemId) {
            socketService.drop(itemId);
        }

        function addPlayer(newPlayer) {
            if (this.player) {
                if (newPlayer.login === this.player.login) {
                    this.player = newPlayer;
                    return $rootScope.$emit('updateGrid');
                }
            }

            var alreadyExist = this.players.find(function (player) {
                return player.login === newPlayer.login;
            });

            if (alreadyExist) {
                // console.log(`${newPlayer.login} est deja co, on update`);
                alreadyExist = newPlayer;
                // alreadyExist.x = newPlayer.x;
                // alreadyExist.y = newPlayer.y;
                // alreadyExist.lvl = newPlayer.lvl;
                // alreadyExist.life = newPlayer.life;
                // alreadyExist.lifeMax = newPlayer.lifeMax;
                // alreadyExist.xp = newPlayer.xp;
                // alreadyExist.xpLvl = newPlayer.xpLvl;
                // alreadyExist.rot = newPlayer.rot;
            } else {
                this.players.push(newPlayer);
            }

            $rootScope.$emit('updateGrid');
        }

        function removePlayer(login) {
            var index = this.players.findIndex(function (player) {
                return player.login === login;
            });
            if (index !== -1) {
                this.players.splice(index, 1);
                $rootScope.$emit('updateGrid');
            }
        }

        function addItem(newItem) {
            var alreadyExist = this.items.find(function (item) {
                return item.id === newItem.id;
            });
            if (!alreadyExist) {
                this.items.push(newItem);
            }

            $rootScope.$emit('updateGrid');
        }

        function removeItem(itemId) {
            var index = this.items.findIndex(function (item) {
                return item.id === itemId;
            });
            if (index !== -1) {
                this.items.splice(index, 1);
                $rootScope.$emit('updateGrid');
            }
        }

        function addInventory(newItem) {
            var alreadyExist = this.inventory.find(function (item) {
                return item.id === newItem.id;
            });
            if (!alreadyExist) {
                this.inventory.push(newItem);
            } else {
                alreadyExist = newItem;
            }
            $rootScope.$emit('updateInventory');

        }

        function removeInventory(itemId) {
            var index = this.inventory.findIndex(function (item) {
                return item.id === itemId;
            });
            if (index !== -1) {
                this.inventory.splice(index, 1);
                $rootScope.$emit('updateInventory');
            }
        }

        // PRIVATE
        function move(e, direction) {
            socketService.move(direction);
        }
        function rotate(e, direction) {
            socketService.rotate(direction);
        }
        function attack() {
            socketService.attack(this.player.rot);
        }
        function pick() {
            socketService.pick();
        }

        // EVENTS
        $rootScope.$on('move', move);
        $rootScope.$on('rotate', rotate);
        $rootScope.$on('attack', attack.bind(service));
        $rootScope.$on('pick', pick.bind(service));

        return service;
    }
}());