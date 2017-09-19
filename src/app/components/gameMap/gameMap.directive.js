(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('gameMap', gameMap);

  /** @ngInject */
  function gameMap($log, levelDataHandler) {
    return {
      restrict: 'E',
      controller: controller,
      controllerAs: 'gameMap',
      templateUrl: "app/components/gameMap/gameMap.html"
    };

    function controller($scope) {
      var vm = this;
      vm.roomKeys = ['lobby', 'conferenceRoom', 'anniesOffice', 'mikesOffice', 'fransOffice', 'breakRoom'];
      vm.roomHasConversation = roomHasConversation;
      vm.show = false;

      updateConversations();

      $scope.$watch(function() {
        return $scope.main.completedConvos.join(",")
      }, function() {
        if (Array.isArray($scope.main.completedConvos)) {
          updateConversations();
        }
      });

      $scope.$watch(function() {
        return $scope.main.levelCount
      }, function() {
        updateConversations();
      });

      function roomHasConversation(roomKey) {
        var room = vm.rooms[roomKey];
        var main = $scope.main;

        if (!room.characters) {
          return false;
        }

        for (var personName in room.characters) {
          if (room.characters[personName]) {
            var personInfo = room.characters[personName];
            if (personInfo.dialogKey || personInfo.successPaths) {
              if (main.completedConvos.indexOf(personInfo.dialogKey) < 0) {
                return true;
              }
            }
            if (personInfo.secondConvo) {
              if (main.completedConvos.indexOf(personInfo.secondConvo.dialogKey) < 0) {
                return true;
              }
            }


          }

        }
        return false;

      }

      function updateConversations() {
        if (!$scope.main.levelCount) {
          return;
        }
        vm.roomConversations = {};
        vm.levels = levelDataHandler["level_" + $scope.main.levelCount];
        vm.rooms = vm.levels.rooms;
        angular.forEach(vm.roomKeys, function(roomKey) {
          vm.roomConversations[roomKey] = roomHasConversation(roomKey);
        });
      }

    }


  }






})();
