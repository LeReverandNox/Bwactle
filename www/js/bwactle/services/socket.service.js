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
            connect: connect
        };

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

                    self.socket = socketFactory({ioSocket: socket});
                    cb(false, player);
                }
            };

            socket.on('connect', function(msg) {
                socket.on('msg', msgCb);
                socket.on('player/add', playerAddCb);
            });
        }
        return service;
    }
}());