(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.service('dialogOptions', dialogOptions);

	/** @ngInject */
	function dialogOptions($log) {
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