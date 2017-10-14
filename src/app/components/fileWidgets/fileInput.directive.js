(function() {
	'use strict';

	angular.module('importContent')
		.directive('loadXlsxFile', xlsxFile);

	/** @ngInject */
	function xlsxFile() {
		return {
			restrict: 'A',
			scope: {
				loadXlsxFile: '&'
			},
			link: link
		};

		function link(scope, elm) {

			elm.on('click', function() {
				$(elm)[0].value = null; // so that we get a change event...
			});

			elm.on('change', function(e) {

				if (e.target.files && e.target.files.length==1) {
					scope.loadXlsxFile({'fileObject':e.target.files[0]});
				}

				scope.$apply();

			});
		}
	}
})();
