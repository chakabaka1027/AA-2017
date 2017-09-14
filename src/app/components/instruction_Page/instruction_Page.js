(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('instructionPage', instructionPage)

	/** @ngInject */
	function instructionPage($location, userDataService, $log, $state, dialogService){ //$log parameter goes in here
		var directive = {
			restrict: 'E',
			templateUrl: "app/components/instruction_Page/instruction_Page.html",
			scope: {
				main: "="
			},
			controller: introController,
			controllerAs: 'vm',
			bindToController: true
		};
		return directive;

		/** @ngInject */
		function introController(){
			var vm = this;
			vm.next = next;
			vm.clickCounter = 0;
			vm.loadPositive = loadPositive;
			vm.getVersion = getVersion;

			function loadPositive(){

				vm.isLoading = true;

				dialogService.loadFromServer("positive").then(function(){
			        dialogService.deferred.resolve();
			        $log.log("Successfully received xlsx");

			        $state.go("awkwardAnnieGame")

		    	});



			}

			function getVersion(){
				var path = $location.path();
				var p = path.toString();
				if(p.includes("negative")){

					return 10;
				}
				else {

					return -10;
				}
			}

			function next(){
				vm.clickCounter += 1;
				userDataService.trackAction(vm.levelCount,"Start","Game_Start","Game Start");
				if(vm.clickCounter >= 2){

					$state.go("awkwardAnnieGame");
				}
			}
		}
	}
})();
