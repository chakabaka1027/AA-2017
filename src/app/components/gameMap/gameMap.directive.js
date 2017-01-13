(function(){
	'use strict';
	
	angular
		.module('awkwardAnnie')
		.directive('gameMap', gameMap);

	/** @ngInject */
	function gameMap($log, levelDataHandler){
		return {
			restrict: 'E',
			controller: controller,
			controllerAs: 'gameMap',
			templateUrl: "app/components/gameMap/gameMap.html"
		};

		function controller($scope, $attrs){
			var vm = this;
			vm.levels = levelDataHandler[$attrs.name];
			vm.rooms = vm.levels.rooms;
			vm.roomKeys = ['lobby', 'conferenceRoom', 'anniesOffice', 'mikesOffice', 'fransOffice', 'breakRoom'];
			vm.roomHasConversation = roomHasConversation;
			vm.show = false;

			$scope.$watch(function(){return $scope.levelTest}, function(){
				$log.log("level = " + $scope.levelTest)
				updateConversations();
			});

			function roomHasConversation(roomKey){
				var room = vm.rooms[roomKey];
				if (!room.characters){
					return false;
				}

				for(var personName in room.characters){
					if(room.characters[personName]){
						if(room.characters[personName].successPaths){
							return true;
						}
					}

				}
				return false;

			}

			function updateConversations(){
				if (!$scope.levelTest){
					return;
				}
				vm.roomConversations = {};
				vm.levels = levelDataHandler[$scope.levelTest];
				vm.rooms = vm.levels.rooms;
				angular.forEach(vm.roomKeys, function(roomKey){
					vm.roomConversations[roomKey] = roomHasConversation(roomKey);
				});
			}
		}

		
	}






})();