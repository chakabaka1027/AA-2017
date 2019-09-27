(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('templateTest', templateTest)
		.service('parseLevelsService', parseLevelsService);
	/** @ngInject */
	function templateTest($log, parseAAContentService ) {
		console.log("hello world");
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
	function parseLevelsService (xlsxService){

		function   parseTemplateSheet (sheet, gameType){
			var numRows = xlsxService.findSheetSize(sheet).r;
			var startRow = 0;
			for(var r = 0; r < numRows ; r++){ //or manually add it in ---
				if (('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase() === 'level') {
							startRow = r + 1;
				}
			}
			var templateRows =[]; //works
			for (var r = startRow; r < numRows ; r++){
				if(xlsxService.cellValue(sheet, 0, r)!=''){
					templateRows[r-10] = {
						level : xlsxService.cellValue(sheet, 0, r),
						charecter : xlsxService.cellValue(sheet, 1, r),
						convo : xlsxService.cellValue(sheet, 2, r),
						room : xlsxService.cellValue(sheet, 3, r),
						room_pos : xlsxService.cellValue(sheet, 4, r)
							}
				}
		}
		console.log(templateRows);
		return templateRows;
		}
	}//parse level service




})();


//goal - change level structure to that of json object file
