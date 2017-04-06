(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('logInManager', logInManager)

	/** @ngInject */
	function logInManager($location, userDataService, globalGameInfo, $log){ //$log parameter goes in here
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
			if($location.url() != "/"){ //if there's other characters in the url
				vm.needLogIn = false;
				var nonAlphaNum = new RegExp("[a-zA-Z0-9\_\s:]");
				var idQuery = $location.url().split("?")[1];
				var id = "";
				if(idQuery.split("&")[1]){
					globalGameInfo.postURL = idQuery.split("&")[1].split('=')[1];
					idQuery = idQuery.split(/ID\=|id\=/)[1]; 
					setID();
				}else{//if only id is passed in
					idQuery = idQuery.split(/ID\=|id\=/)[0]; 
					setID();
				}
			}else{ //else if location is = to "...../"
				$location.path("/");
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
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				$state.go("instructions");  

				//$location.path("/instructions").search({USERID: vm.playerID});
			}

			function next(){ //make sure ID is a number and assign it to the data service
				userDataService.userID = vm.playerID;
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				$state.go("instructions");  

				//$location.path("/instructions").search({USERID: vm.playerID});
			}
		}//end of controller
	}
})();