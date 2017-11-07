(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.service('dialogOptions', dialogOptions);

	/** @ngInject */
	function dialogOptions() {
		var service = {
			hideDialog: true,
			animationTitle:"",
			animationDone :true,
			talkingWith:"",
			flipDialogs: true
		};

		return service;

	}

})();
