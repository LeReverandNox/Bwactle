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
            function findDropButtonAt(x) {
                return $inventoryHolder.find('.inventory-button').eq(x);
            }

            function initInventory() {
                var i, $cell, $button, $holder;
                for (i = 0; i < 3; i += 1) {
                    $holder = angular.element('<div class="inventory-item-holder"></div>').appendTo($inventoryHolder);
                    $cell = angular.element('<div class="inventory-cell"></div>').appendTo($holder);
                    $button = angular.element('<br/><button class="inventory-button button button-balanced">Drop</button>').appendTo($holder);
                    $cell.css('background-color', 'white');
                }
            }

            function cleanInventory() {
                var i, $cell, $button;
                for (i = 0; i < 3; i += 1) {
                    $cell = findCellAt(i).css('background-color', 'white').html(null)
                        .attr('item-id', '')
                        .attr('action', '');
                    $cell.qtip('destroy');

                    $button = findDropButtonAt(i)
                        .attr('item-id', '')
                        .attr('action', '');
                }
            }

            function updateInventory() {
                console.log('On va update linvetaire');
                console.log(gameService.inventory);
                console.log('***');
                var x = 0;

                cleanInventory();

                gameService.inventory.forEach(function (item) {
                    var $cell, $button;

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

                    $button = findDropButtonAt(x)
                        .attr('item-id', item.id)
                        .attr('action', 'drop');
                    x += 1;
                });
            }

            $rootScope.$on('initInventory', initInventory);
            $rootScope.$on('updateInventory', updateInventory);
        }
    }
}());