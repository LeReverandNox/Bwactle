/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .factory("socketService", socketService);

    socketService.$inject = ["socketFactory"];

    function socketService(socketFactory) {
        var service = {
            // Attributes
            apiUrl: 'http://wac.epitech.eu:1337',
            socket: null,
            //Methods
            connect: connect,
            disconnect: disconnect,
            onPlayerAdd: onPlayerAdd,
            onPlayerMove: onPlayerMove,
            onItemAdd: onItemAdd,
            onItemRemove: onItemRemove,
            onMsg: onMsg,
            move: move,
            attack: attack,
            pick: pick
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
        function onMsg(cb) {
            this.socket.on('msg', function (msg) {
                cb(msg);
            });
        }

        function move(direction) {
            this.socket.emit('move', direction);
        }

        function attack(direction) {
            this.socket.emit('attack', direction);
        }
        function pick() {
            this.socket.emit('pick');
        }
    }
}());