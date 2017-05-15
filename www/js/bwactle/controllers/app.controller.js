/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .controller("App", AppController);

    AppController.$inject = ["$scope", "$ionicModal", "$state"];

    function AppController($rootScope, $scope, $state) {
        var A = this;

        A.logout = function () {
            console.log('ON LOGOUT !!!');
        };
    }
}());
