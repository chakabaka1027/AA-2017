(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('gameMap', gameMap);

  /** @ngInject */
  function gameMap($log, levelDataHandler, roomData) {
    return {
      restrict: 'E',
      controller: controller,
      controllerAs: 'gameMap',
      templateUrl: "app/components/gameMap/gameMap.html"
    };

    function controller($scope) {
      var vm = this;
      vm.roomKeys = ['room6', 'room2', 'room4', 'room1', 'room3', 'room5'];
      vm.roomHasConversation = roomHasConversation;
      vm.show = false;

      updateConversations();

      $scope.$watch(function() {return $scope.main.completedConvos.join(",")}, function() {
        if (Array.isArray($scope.main.completedConvos)) {
          updateConversations();
        }
      });

      $scope.$watch(function() {return $scope.main.levelCount}, function() {
        updateConversations();
      });

      function roomHasConversation(roomKey) {

        var room = vm.rooms[roomData.roomNameMapping[roomKey]];
        var main = $scope.main;

        $log.log('rooms: ',vm.rooms, roomKey, room);

        if (!room) {
          return false;
        }

        for (var personName in room) {
          if (room[personName]) {

            var personInfo = room[personName];
            var hasConvo = false;
            
            personInfo.dialogInfo.forEach(function(dInfo) {
              if (dInfo.key && main.completedConvos.indexOf(dInfo.key) < 0) {
                hasConvo = true;
              }
            });

            if (hasConvo) { 
              return true;
            }

          }
        }
        return false;
      }

      function updateConversations() {
        if (!$scope.main.levelCount) {
          return;
        }

        var nextLevel = levelDataHandler.levels["level_" + $scope.main.levelCount];////TODO !!! NEW CHANGE HERE
        if (!nextLevel) {
          $log.log('reached end of levels...');
          return;
        }
        vm.level = nextLevel;
        vm.roomConversations = {};
        vm.rooms = vm.level.rooms;
        angular.forEach(vm.roomKeys, function(roomKey) {
          vm.roomConversations[roomKey] = roomHasConversation(roomKey);
        });
      }
    }
  }

})();
