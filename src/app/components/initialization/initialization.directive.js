(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('initializeGame', initializeGame);

	/** @ngInject */
	function initializeGame($log, $q, $http, $state, $timeout, $location, $stateParams, gameConfig, globalGameInfo) {

		return {
			restrict: 'E',
			controller: controller,
			template: '<div><h1>I am initializing!!!!</h1><div ng-click="clickMe()">Click me!!!</div></div>'
		};

		function controller($scope) {
			var configData;

			var gameType;

			gameConfig.fetchConfig()
				.then(function() {
					gameType = $stateParams.gameType || 'negative';
					globalGameInfo.gameType = gameType;
					var userID = $location.search().userID; //user ID is a qury param -  (--rul > key=value)

					if (userID) {//if it is in the dictionary
						globalGameInfo.userForwarded = true;
						globalGameInfo.userID = userID;
					}
					else {
						globalGameInfo.userForwarded = false;
					}

					// other stuff.....


					if (globalGameInfo.userForwarded) {
						$state.go('instructions');
					} else {
						$state.go('GameStart');
					}
				})



		}

	}

})();

















