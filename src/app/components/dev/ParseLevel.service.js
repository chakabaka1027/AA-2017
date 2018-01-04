(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('parseLevelsService', parseLevelsService);
	/** @ngInject */
	function parseLevelsService($log, parseAAContentService ) {
		return {
			restrict: 'E',
			controller: controller,
			template: '<div>Hello!</div>'
		};

		function controller($scope) {
			// $log.log(angular.toJson(parseLevelsService,4);
		}
	}


})();


//goal - change level structure to that of json object file
