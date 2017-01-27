(function(){
	'use strict';
	
	angular.module('awkwardAnnie')
	.service('dialogueService', dialogueService);

//how to use it
// service.getDialogs("LinearMike");

	/** @ngInject */
	function dialogueService($http){
		var service = this;
		var dialoguePaths = {
			// Charlie
			charlie_01: "assets/json/CC.STwGr.01.json",
			charlie_02: "assets/json/CC.RQwGR.02.json", 
			// Fran
			fran_Linear:"assets/json/FF.Linear.json",
			// fran_Linear_02:"assets/json/FF.Linear.02.json",
			fran_GR_01:"assets/json/FF.GR.01.json",
			fran_GR_02:"assets/json/FF.GR.02.json",
			fran_SmallTk_01:"assets/json/FF.ST.01.json",
			fran_SmallTk_02:"assets/json/FF.ST.02.json",
			fran_RQ_01:"assets/json/FF.RQ.01.json",
			fran_RQ_02:"assets/json/FF.RQ.02.json", 
			// Luna
			luna_01: "assets/json/LL.STwGr.01.json",
			luna_02: "assets/json/LL.STwGR.02.json", 
			// Mike
			mike_Linear:"assets/json/MM.Linear.json",
			mike_GR_01:"assets/json/MM.GR.01.json",
			mike_GR_02:"assets/json/MM.GR.02.json",
			mike_SmallTk_01:"assets/json/MM.ST.01.json",
			mike_SmallTk_02:"assets/json/MM.ST.02.json",
			mike_RQ_01:"assets/json/MM.RQ.01.json",
			mike_RQ_02:"assets/json/MM.RQ.02.json"
		};

		service.getDialogs = function(dialogue){
			return $http.get(dialoguePaths[dialogue]).then(function(response){
				return response.data;
			});
		};
		service.getDialogKeys = getDialogKeys;

		function getDialogKeys(){
			return Object.keys(dialoguePaths);
		}
	}



})();