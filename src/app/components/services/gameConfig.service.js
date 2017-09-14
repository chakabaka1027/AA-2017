(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.service('gameConfig', gameConfig);

	/** @ngInject */
	function gameConfig($http, $log, $q) {
		var deferred = $q.defer();

		var service = {
			version: 0,
			startState: undefined,
			fetchConfig: fetchConfig
		};

		return service;

		function fetchConfig() {
			return $http.get('assets/config.json')
				.then(function(response) {
					angular.extend(service, response.data);
				});
		}
	}
})();