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
                        $cell.css('background-color', 'white');
                    }
                }
            }

            function findOrientation(entity) {
                var char;

                switch (entity.rot) {
                    case 'up':
                        char = "&uarr;";
                        break;
                    case 'down':
                        char = "&darr;";
                        break;
                    case 'left':
                        char = "&larr;";
                        break;
                    case 'right':
                        char = "&rarr;";
                        break;
                    default:
                        break;
                }

                return char;
            }

            function spawnPlayers() {
                gameService.players.forEach(function (player) {
                    // console.log(`On a ce plauyer dand l'array ${player.login}`);
                    if ((player.x <= gridLastIndexX && player.x >= gridOffsetX) &&
                        (player.y <= gridLastIndexY && player.y >= gridOffsetY))
                    {
                        // console.log(`On a ce player dand l'array`);
                        // console.log(player);

                        var localX, localY;

                        localX = player.x - gridOffsetX;
                        localY = player.y - gridOffsetY;
                        findCellAt(localX, localY)
                            .css('background-color', 'green')
                            .html(findOrientation(player));
                    }
                });
            }

            function spawnItems() {
                gameService.items.forEach(function (item) {
                    if ((item.x <= gridLastIndexX && item.x >= gridOffsetX) &&
                        (item.y <= gridLastIndexY && item.y >= gridOffsetY)) {
                        var localX, localY;
                        // console.log(`On a ce item dand l'array`);
                        // console.log(item);

                        localX = item.x - gridOffsetX;
                        localY = item.y - gridOffsetY;
                        findCellAt(localX, localY).css('background-color', 'blue').html('I');
                    }
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

                findCellAt(playerX, playerY)
                    .css('background-color', 'red')
                    .html(findOrientation(gameService.player));

                console.log(`Real pX ${gameService.player.x}, Real pY ${gameService.player.y}`);
                // console.log(`grid pX ${playerX}, grid pY ${playerY}`);
                // console.log(`grid offsetX ${gridOffsetX}, grid offsetY ${gridOffsetY}`);
                // console.log(`gridLastIndexX ${gridLastIndexX}, gridLastIndexY ${gridLastIndexY}`);
            }

            function cleanGrid() {
                var i, j, $row, $cell;
                for (i = 0; i < 11; i += 1) {
                    for (j = 0; j < 11; j += 1) {
                        findCellAt(i, j).css('background-color', 'white').html(null);
                    }
                }
            }

            function updateGrid() {
                cleanGrid();
                spawnPlayer();
                spawnPlayers();
                spawnItems();
            }

            function isCellAtAvailable(x, y) {
                if (x < 0 || y < 0) {
                    return false;
                }
                var cell = findCellAt(x, y);
                // console.log(`Voici la next cell a ${x} ${y}`);
                // console.log(cell.css('background-color'), cell.html());
                if (cell.css('background-color') === 'rgb(255, 255, 255)' && cell.html() === '') {
                    return true;
                }
            }

            function startEmitters() {
                var nextLocalX, nextLocalY;

                angular.element(document).keydown(function (e) {
                    console.log(e.which);
                    switch (e.which) {
                    case 37: // left
                        nextLocalX = (gameService.player.x - gridOffsetX - 1);
                        nextLocalY = (gameService.player.y - gridOffsetY);
                        if (isCellAtAvailable(nextLocalX, nextLocalY)) {
                            $rootScope.$emit('move', 'left');
                        } else {
                            $rootScope.$emit('rotate', 'left');
                        }
                        break;
                    case 38: // up
                        nextLocalX = (gameService.player.x - gridOffsetX);
                        nextLocalY = (gameService.player.y - gridOffsetY - 1);
                        if (isCellAtAvailable(nextLocalX, nextLocalY)) {
                            $rootScope.$emit('move', 'up');
                        } else {
                            $rootScope.$emit('rotate', 'up');
                        }
                        break;
                    case 39: // right
                        nextLocalX = (gameService.player.x - gridOffsetX + 1);
                        nextLocalY = (gameService.player.y - gridOffsetY);
                        if (isCellAtAvailable(nextLocalX, nextLocalY)) {
                            $rootScope.$emit('move', 'right');
                        } else {
                            $rootScope.$emit('rotate', 'right');
                        }
                        break;
                    case 40: // down
                        nextLocalX = (gameService.player.x - gridOffsetX);
                        nextLocalY = (gameService.player.y - gridOffsetY + 1);
                        if (isCellAtAvailable(nextLocalX, nextLocalY)) {
                            $rootScope.$emit('move', 'down');
                        } else {
                            $rootScope.$emit('rotate', 'down');
                        }
                        break;
                    case 65: // A
                        $rootScope.$emit('attack');
                        break;
                    case 80: // P
                        $rootScope.$emit('pick');
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