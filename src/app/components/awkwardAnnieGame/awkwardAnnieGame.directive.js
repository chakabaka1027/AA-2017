(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('awkwardAnnieGame', awkwardAnnieGame);

	/** @ngInject */
	function awkwardAnnieGame() {
		return {
			restrict: 'E',
			controller: controller,
			templateUrl: 'app/components/awkwardAnnieGame/awkwardAnnieGame.html'
		};

	}

	function controller($scope, mainInformationHandler ) {

		$scope.main = mainInformationHandler;
	}

})();
