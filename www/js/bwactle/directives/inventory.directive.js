/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("bwactle")
        .directive("inventory", inventoryDirective);

    inventoryDirective.$inject = ["$rootScope", "gameService"];

    function inventoryDirective($rootScope, gameService) {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "templates/inventory.html",
            controller: "Inventory",
            controllerAs: "I",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
            var $inventoryHolder = element.children(".game-inventory");

            function findCellAt(x) {
                return $inventoryHolder.find('.inventory-cell').eq(x);
            }

            function initInventory() {
                var i, $cell;
                for (i = 0; i < 3; i += 1) {
                    $cell = angular.element('<div class="inventory-cell"></div>').appendTo($inventoryHolder);
                    $cell.css('background-color', 'white');
                }
            }

            function cleanInventory() {
                var i, $cell;
                for (i = 0; i < 3; i += 1) {
                    $cell = findCellAt(i).css('background-color', 'white').html(null);
                    $cell.qtip('destroy');
                }
            }

            function updateInventory() {
                console.log('On va update linvetaire');
                console.log(gameService.inventory);
                console.log('***');
                var x = 0;

                cleanInventory();

                gameService.inventory.forEach(function (item) {
                    var $cell;

                    $cell = findCellAt(x)
                        .css('background-color', 'blue')
                        .html('I')
                        .attr('item-id', item.id)
                        .attr('action', 'equip');
                    $cell.qtip({
                        show: 'tap',
                        hide: {
                            delay: 1000
                        },
                        content: {
                            title: 'Item:',
                            text: 'Name: ' + item.name + ',</br>Damages: ' + item.dmg + ',</br>Type: ' + item.type + ',</br>Uses: ' + item.use
                        }
                    });

                    x += 1;
                });
            }

            $rootScope.$on('initInventory', initInventory);
            $rootScope.$on('updateInventory', updateInventory);
        }
    }
}());