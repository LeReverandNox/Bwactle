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
            equipedItem: null,
            inventory: [],
            players: [],
            items: [],
            isStarted: false,
            //Methods
            init: init,
            startListeners: startListeners,
            addPlayer: addPlayer,
            isWeapon: isWeapon,
            // Getters / Setters
            setPlayer: setPlayer
        };

        function init(cb) {
            // DEBUG
            // this.inventory = [
            //     { x: null, y: null, id: "591dd08677479d743548ad45", name: "Sword", dmg: 30, type: "weapon", use: -1 },
            //     { x: null, y: null, id: "591db9f777479d743548a8fc", name: "Toxic Cloud", dmg: 55, type: "spell", use: 2 }
            // ];
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
            socketService.onPlayerHurt(hurtPlayer.bind(this));
            socketService.onPlayerXP(addPlayer.bind(this));
            socketService.onPlayerLevel(addPlayer.bind(this));
            socketService.onPlayerRemove(removePlayer.bind(this));
            socketService.onItemAdd(addItem.bind(this));
            socketService.onItemRemove(removeItem.bind(this));
            socketService.onInventoryAdd(addInventory.bind(this));
            socketService.onInventoryRemove(removeInventory.bind(this));
            socketService.onInventoryUpdate(addInventory.bind(this));
            socketService.onEquipementSet(setEquipement.bind(this));
            socketService.onEquipementUnset(unsetEquipement.bind(this));
            socketService.onMsg(displayMessage.bind(this));
        }

        function hurtPlayer(hurtedPlayer) {
            if (this.player) {
                if (hurtedPlayer.login === this.player.login) {
                    var newLife = this.player.life - hurtedPlayer.life;
                    $rootScope.$emit('updateMsg', {type: 0, content: 'You loose ' + newLife + ' HP !'});
                }
            }
            addPlayer.call(this, hurtedPlayer);
        }

        function isWeapon(itemId) {
            var alreadyExist = this.inventory.find(function (item) {
                return item.id === itemId;
            });
            if (alreadyExist.type === 'weapon') {
                return true;
            }
            return false;
        };

        function addPlayer(newPlayer) {
            console.log(newPlayer);
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

        function setEquipement(item) {
            this.equipedItem = item;
            $rootScope.$emit('updateGrid');
        }

        function unsetEquipement() {
            this.equipedItem = null;
            $rootScope.$emit('updateGrid');
        }

        function displayMessage(msg) {
            $rootScope.$emit('updateMsg', msg);
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
        function cast(e, itemId, direction) {
            socketService.cast(itemId, direction);
        }
        function pick() {
            socketService.pick();
        }
        function equip(e, itemId) {
            socketService.equip(itemId);
        }
        function drop(e, itemId) {
            socketService.drop(itemId);
        }
        function unequip() {
            socketService.unequip();
        }
        // EVENTS
        $rootScope.$on('move', move);
        $rootScope.$on('rotate', rotate);
        $rootScope.$on('attack', attack.bind(service));
        $rootScope.$on('cast', cast.bind(service));
        $rootScope.$on('pick', pick.bind(service));
        $rootScope.$on('equip', equip.bind(service));
        $rootScope.$on('drop', drop.bind(service));
        $rootScope.$on('unequip', unequip.bind(service));

        return service;
    }
}());