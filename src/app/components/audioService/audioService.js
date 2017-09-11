(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.service('audioService', audioService);

	/** @ngInject */
	function audioService($log, $window) {

		var audioFolder = 'assets/sounds/';

		var service = {
			audioTags: {},
			playAudio: function(fname) {
				var audioTag = service.audioTags[fname];
				if (audioTag) {
					audioTag.currentTime = 0;
					audioTag.play();
				} else {
					audioTag = new $window.Audio(audioFolder+fname); 
					service.audioTags[fname] = audioTag;
					audioTag.play();
				}
			}
		};

		return service;

	}

})();
