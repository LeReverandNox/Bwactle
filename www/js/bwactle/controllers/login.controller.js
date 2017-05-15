/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("Login", LoginController);

    LoginController.$inject = ["$rootScope", "$scope", "$ionicPopup", "$state" ,"userService"];

    function LoginController($rootScope, $scope, $ionicPopup, $state, userService) {
        var L = this;

        L.user = {
            login: '',
            password: ''
        };

        L.login = function (user) {
            userService.login(user, function (err, player) {
                if (err) {
                    console.log(err);
                    return $ionicPopup.alert({
                        title: "Uh-oh... something went wrong !",
                        template: err
                    }).then(function () {
                        L.user.password = "";
                    });
                }
                console.log('On est co !!!');
                console.log(player);
                $state.go('app.game');
            });
        };
    }
}());
