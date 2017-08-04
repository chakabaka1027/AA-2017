(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('logInManager', logInManager)

	/** @ngInject */
	function logInManager($location, userDataService, globalGameInfo, $log, $stateParams, dialogService, levelDataHandler){ //$log parameter goes in here
		var directive = {
			restrict: 'AE',
			controller: introController,
			templateUrl: "app/components/logIn_Manager/introSpecs.html",
			scope: {
				main: "="
			},
			controllerAs: 'vm',
			bindToController: true
		};
		return directive;
		
		/** @ngInject */
		function introController($timeout, $location, $state){
			var vm = this;
			vm.checkID = checkID;
			vm.next = next;
			vm.needLogIn = true;

			$log.log("THESE ARE THE STATEPARAMS");
			$log.log($stateParams);

			var gameType;
    		if(levelDataHandler.legalLevels.indexOf($stateParams.gameType) < 0){
    			gameType = 'negative';
    		} else {
    			gameType = $stateParams.gameType;
    		}

    		levelDataHandler.setUpForGameType(gameType);
		    
		    dialogService.loadFromServer($stateParams.gameType).then(
		      function(){
		        dialogService.deferred.resolve();
		        $log.log("Successfully received xlsx");
		    });

			var userID = $location.search().userID;
			if (userID) {
				checkInAs(userID);
				$log.log("checked in");
			}

			function setID(){
				for(var i in idQuery){
					if(!nonAlphaNum.test(idQuery[i])){
						break;
					}
					id += idQuery[i];
				}
				vm.playerID = id;
			}

			function checkID(){ //make sure ID is a number and assign it to the data service
				userDataService.userID = vm.playerID;
				userDataService.resetData();
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				$state.go("instructions");  

				//$location.path("/instructions").search({USERID: vm.playerID});
			}

			function next(){ //make sure ID is a number and assign it to the data service
				userDataService.userID = vm.playerID;
				userDataService.resetData();
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				$state.go("instructions");  

				//$location.path("/instructions").search({USERID: vm.playerID});
			}

			function checkInAs(id) {
				userDataService.userID = vm.playerID = id;
				userDataService.resetData();
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				$state.go("instructions");
			}
		}//end of controller
	}
})();