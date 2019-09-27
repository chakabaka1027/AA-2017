(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('loadLevelTest', loadLevelTest);
	/** @ngInject */
	function loadLevelTest($log, parseLevelsService) {
		return {
			restrict: 'E',
			controller: controller,
			template: '<div>Hello!</div>'
		};

		function controller($scope) {
			// $log.log(angular.toJson(parseLevelsService,4));

		}
	}

	////parseAAContentService //parseLevelsService

})();
