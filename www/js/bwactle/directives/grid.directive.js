/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .directive("grid", gridDirective);

    gridDirective.$inject = ["$rootScope", "gameService"];

    function gridDirective($rootScope, gameService) {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "/templates/grid.html",
            controller: "Grid",
            controllerAs: "G",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
            var $gridHolder = element.children(":first");
            var gridOffsetX, gridOffsetY;
            var gridLastIndexX, gridLastIndexY;

            function findCellAt(x, y) {
                return $gridHolder.find('.game-row').eq(y).find('.game-cell').eq(x);
            }

            function initGrid() {
                var i, j, $row, $cell;
                for (i = 0; i < 11; i += 1) {
                    $row = angular.element('<div class="game-row"></div>').appendTo($gridHolder);
                    for (j = 0; j < 11; j += 1) {
                        $cell = angular.element('<div class="game-cell"></div>').appendTo($row);
                    }
                }
            }

            function spawnPlayers() {
                gameService.players.forEach(function (player) {
                    // console.log(`On a ce plauyer dand l'array ${player.login}`);
                    if ((player.x <= gridLastIndexX && player.x >= gridOffsetX) &&
                        (player.y <= gridLastIndexY && player.y >= gridOffsetY))
                    {
                        // console.log('On doit afficher de player car il est dans le viewport');
                        // console.log(`${player.login}, x:${player.x}, y:${player.y}`);
                        var localX, localY;

                        localX = player.x - gridOffsetX;
                        localY = player.y - gridOffsetY;
                        findCellAt(localX, localY).css('background-color', 'green');
                    }
                });
            }

            function spawnItems() {
                gameService.items.forEach(function (item) {

                });
            }

            function spawnPlayer() {
                var playerX, playerY;

                if (gameService.player.x < 5) {
                    playerX = gameService.player.x;
                    gridOffsetX = 0;
                } else if (gameService.player.x > 34) {
                    playerX = Math.abs(10 - (39 - gameService.player.x));
                    gridOffsetX = gameService.player.x - playerX;
                } else {
                    playerX = 5;
                    gridOffsetX = gameService.player.x - 5;
                }

                if (gameService.player.y < 5) {
                    playerY = gameService.player.y;
                    gridOffsetY = 0;
                } else if (gameService.player.y > 34) {
                    playerY = Math.abs(10 - (39 - gameService.player.y));
                    gridOffsetY = gameService.player.y - playerY;

                } else {
                    playerY = 5;
                    gridOffsetY = gameService.player.y - 5;
                }

                gridLastIndexX = gridOffsetX + 10;
                gridLastIndexY = gridOffsetY + 10;

                findCellAt(playerX, playerY).css('background-color', 'red');

                console.log(`Real pX ${gameService.player.x}, Real pY ${gameService.player.y}`);
                // console.log(`grid pX ${playerX}, grid pY ${playerY}`);
                // console.log(`grid offsetX ${gridOffsetX}, grid offsetY ${gridOffsetY}`);
                // console.log(`gridLastIndexX ${gridLastIndexX}, gridLastIndexY ${gridLastIndexY}`);
            }

            function cleanGrid() {
                var i, j, $row, $cell;
                for (i = 0; i < 11; i += 1) {
                    for (j = 0; j < 11; j += 1) {
                        findCellAt(i, j).css('background-color', 'white');
                    }
                }
            }

            function updateGrid() {
                cleanGrid();
                spawnPlayer();
                spawnPlayers();
                spawnItems();
            }

            function startEmitters() {
                angular.element(document).keydown(function (e) {
                    switch(e.which) {
                        case 37: // left
                            $rootScope.$emit('move', 'left');
                            break;
                        case 38: // up
                            $rootScope.$emit('move', 'up');
                            break;
                        case 39: // right
                            $rootScope.$emit('move', 'right');
                            break;
                        case 40: // down
                            $rootScope.$emit('move', 'down');
                            break;
                        default: return; // exit this handler for other keys
                    }
                    e.preventDefault(); // prevent the default action (scroll / move caret)
                });
            }

            $rootScope.$on('initGrid', initGrid);
            $rootScope.$on('updateGrid', updateGrid);
            $rootScope.$on('startEmitters', startEmitters);
        }
    }
}());