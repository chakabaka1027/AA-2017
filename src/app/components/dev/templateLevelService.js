(function() {
	'use strict';

	angular.module('awkwardAnnie')
  .service('parseLevelsService', parseLevelsService);
	/** @ngInject */
	function parseLevelsService($log, parseAAContentService ) {
		return {
			restrict: 'E',
			controller: controller,
			template: '<div>Hello!</div>'
		};

		function controller($scope) {
			// $log.log(angular.toJson(parseLevelsService,4);
			console.log("omsode parseLevelServive",parseAAContentService.TemplateSheets);
		}
	}


})();
