(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('levelManager', levelManager);

	/** @ngInject */
	function levelManager(dialogService, $log){ //$log parameter goes in here
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/dialogManager/dialogManager.html',
			controller: levelManagerController,
			scope: {
				main: "=",
				levelCount:"="
			},
			controllerAs: 'vm',
			bindToController: true
		};
		return directive;

		/** @ngInject */
		function levelManagerController(){
			var vm = this;

			var totalConvos = 0;
			// Check if dialogs were all completed and move onto next level
			if(vm.main.levelConvosNeeded.indexOf(vm.main.completedConvos) >= 0){
				totalConvos += 1;
			}
		}//end of controller
	}
})();