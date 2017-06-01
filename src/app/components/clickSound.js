(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('clickSound', clickSound);

	/** @ngInject */
	function clickSound(dialogService, $log, audioService){ //$log parameter goes in here
		var directive = {
			restrict: 'A',
			link: link
		};
		return directive;

		/** @ngInject */
		function link(scope, elm, attrs){
			elm.on("click", function(){
				$log.log("clicked")

				audioService.playAudio("Click.wav");
			})
			
		}
	}
})();