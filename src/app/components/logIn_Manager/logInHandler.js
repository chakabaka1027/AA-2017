(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('logInManager', logInManager)

	/** @ngInject */
	function logInManager($location, userDataService, globalGameInfo, $log, $stateParams, dialogService, levelDataHandler){ //$log parameter goes in here
		console.log("::::--$stateParams.gameType"+$stateParams.gameType);

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
			vm.needLogIn = true; //it is here - by default it is set to true? - location manu[ulates the URL - right? ]

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
		        dialogService.deferred.resolve();//get the right dailoug
		        $log.log("Successfully received xlsx");
		    });

			var userID = $location.search().userID; //user ID is a qury param -  (--rul > key=value)
			if (userID) {//if it is in the ditionay
				globalGameInfo.userForwarded = true;
				checkInAs(userID);//would want to say globalgameinfo.userforwarded  //  == true / check flag
				$log.log("checked in");
			}
			else {
				globalGameInfo.userForwarded = false;
			}
			// else -

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

			function checkInAs(id) {//user ID - need to send it when we quit
				userDataService.userID = vm.playerID = id;
				userDataService.resetData();
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				$state.go("instructions");
			}
		}//end of controller
	}
})();
