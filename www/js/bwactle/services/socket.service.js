/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .factory("socketService", socketService);

    socketService.$inject = ["socketFactory"];
    // socket.on('inventory/Remove', function (item) { }); Update informations about an item in yout inventory
    // socket.on('inventory/add', function (item) { }); An item is added to your inventory
    // socket.on('inveotory/remove', function (item_id) { }); An item is removed from your inventory
    function socketService(socketFactory) {
        var service = {
            // Attributes
            apiUrl: 'ws://wac.epitech.eu:1337',
            socket: null,
            //Methods
            connect: connect,
            disconnect: disconnect,
            onPlayerAdd: onPlayerAdd,
            onPlayerMove: onPlayerMove,
            onPlayerRotation: onPlayerRotation,
            onPlayerRemove: onPlayerRemove,
            onPlayerHurt: onPlayerHurt,
            onPlayerXP: onPlayerXP,
            onPlayerLevel: onPlayerLevel,
            onItemAdd: onItemAdd,
            onItemRemove: onItemRemove,
            onInventoryUpdate: onInventoryUpdate,
            onInventoryAdd: onInventoryAdd,
            onInventoryRemove: onInventoryRemove,
            onEquipementSet: onEquipementSet,
            onEquipementUnset: onEquipementUnset,
            onMsg: onMsg,
            move: move,
            rotate: rotate,
            attack: attack,
            cast: cast,
            pick: pick,
            equip: equip,
            drop: drop,
            unequip: unequip
        };

        return service;

        function connect(user, cb) {
            var self = this;

            var query = 'login=' + user.login + '&pwd=' + user.password;
            var socket = io.connect(this.apiUrl, {query: query});

            var msgCb = function (msg) {
                socket.removeListener('msg', msgCb);
                cb(msg.content);
            };

            var playerAddCb = function (player) {
                if (player.login === user.login) {
                    socket.removeListener('player/add', playerAddCb);
                    socket.removeListener('msg', msgCb);

                    self.socket = socketFactory({ioSocket: socket});
                    cb(false, player);
                }
            };

            socket.on('connect', function(msg) {
                socket.on('msg', msgCb);
                socket.on('player/add', playerAddCb);
            });
        }

        function disconnect(cb) {
            this.socket.disconnect();
            cb(false);
        }

        function onPlayerAdd(cb) {
            this.socket.on('player/add', function (player) {
                cb(player);
            });
        }
        function onPlayerMove(cb) {
            this.socket.on('player/move', function (player) {
                cb(player);
            });
        }
        function onPlayerRotation(cb) {
            this.socket.on('player/rotation', function (player) {
                cb(player);
            });
        }
        function onPlayerRemove(cb) {
            this.socket.on('player/remove', function (login) {
                cb(login);
            });
        }
        function onPlayerHurt(cb) {
            this.socket.on('player/hurt', function (player) {
                cb(player);
            });
        }
        function onPlayerXP(cb) {
            this.socket.on('player/experience', function (player) {
                cb(player);
            });
        }
        function onPlayerLevel(cb) {
            this.socket.on('player/level', function (player) {
                cb(player);
            });
        }
        function onItemAdd(cb) {
            this.socket.on('item/add', function (item) {
                cb(item);
            });
        }
        function onItemRemove(cb) {
            this.socket.on('item/remove', function (itemId) {
                cb(itemId);
            });
        }
        function onInventoryAdd(cb) {
            this.socket.on('inventory/add', function (item) {
                cb(item);
            });
        }
        function onInventoryRemove(cb) {
            this.socket.on('inventory/remove', function (itemId) {
                cb(itemId);
            });
        }
        function onInventoryUpdate(cb) {
            this.socket.on('inventory/update', function (item) {
                cb(item);
            })
        }
        function onEquipementSet(cb) {
            this.socket.on('equipement/set', function (item) {
                cb(item);
            })
        }
        function onEquipementUnset(cb) {
            this.socket.on('equipement/unset', function () {
                cb();
            })
        }
        function onMsg(cb) {
            this.socket.on('msg', function (msg) {
                cb(msg);
            });
        }

        function move(direction) {
            this.socket.emit('move', direction);
        }

        function rotate(direction) {
            this.socket.emit('rotate', direction);
        }

        function attack(direction) {
            this.socket.emit('attack', direction);
        }
        function cast(itemId, direction) {
            this.socket.emit('cast', {item_id: itemId, direction: direction});
        }
        function pick() {
            this.socket.emit('pick');
        }
        function equip(itemId) {
            this.socket.emit('equip', itemId);
        }
        function drop(itemId) {
            this.socket.emit('drop', itemId);
        }
        function unequip() {
            this.socket.emit('unequip');
        }
    }
}());