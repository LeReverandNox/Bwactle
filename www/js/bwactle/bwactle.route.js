/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .config(routerConfig);

    routerConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

    function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        getStates().forEach(function (state) {
            $stateProvider.state(state.state, state.config);
        });
        $urlRouterProvider.otherwise("/game");
    }

    function getStates() {
        return [
            {
                state: 'app',
                config: {
                    url: '/',
                    abstract: true,
                    templateUrl: 'templates/menu.html',
                    controller: 'App',
                    controllerAs: 'A'
                }
            },
            {
                state: 'login',
                config: {
                    url: 'login',
                    templateUrl: 'templates/login.html',
                    controller: 'Login',
                    controllerAs: 'L'
                }
            },
            {
                state: 'app.game',
                config: {
                    url: 'game',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/game.html',
                            controller: 'Game',
                            controllerAs: 'G'
                        }
                    }
                }
            }
        ];
    }
}());
