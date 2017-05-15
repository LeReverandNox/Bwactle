/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .factory("userService", userService);

    userService.$inject = ["socketService"];

    function userService(socketService) {
        var service = {
            // Attributes
            isConnected: false,
            // Methods
            login: login,
            logout: logout
        };

        return service;

        function login(user, cb) {
            var self = this;

            user.login = user.login.trim() || "";
            user.password = user.password.trim() || "";

            if(!user.login || !user.password) {
                return cb('You must enter a login/password.');
            }

            if(user.login.length < 3) {
                return cb('Your username must be at least 3 characters.');
            }

            socketService.connect(user, function (err, data) {
                if (err) {
                    return cb(err);
                }

                self.isConnected = true;
                return cb(false, data);
            });
        }

        function logout() {
            console.log('Voila, on est logout');
        }
    }
}());