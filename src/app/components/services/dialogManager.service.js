(function(){
	'use strict';
//		console.log("!!!service invoked"); 0 service defined - i dont knwo hwta order it is defined in
//its just a pointer in a table

	angular.module('importContent')
	.service('dialogService', dialogContentService);

	// how to use it
	//  service.getDialogs("LinearMike");

	/** @ngInject */
	function dialogContentService($log, $http, $q, parseAAContentService, $timeout){
		console.log("!!!service invoked -dialogContentService");

			  var defaultUrl = {
				positive:	'assets/AwkwardAnnieDialogContent_all.xlsx',
        negative: 'assets/AwkwardAnnieDialogContent_all.xlsx'
			};


		var dialogWorksheetKeys = {};

		var service = {
			getDialogs: getDialogs,
			getDialogKeys: getDialogKeys,
			dialogWorksheetKeys: dialogWorksheetKeys,
			loadFromServer: loadFromServer
		};

		var dialogJsonPaths = {
			// Charlie
			charlie_01: "assets/json/CC.STwGr.01.json",
			// charlie_02: "assets/json/CC.RQwGR.02.json",
			charlie_02: "assets/json/CC.RQ.02.json",

			// Fran
			// fran_Linear:"assets/json/FF.Linear.json",

			//fortesting only
			fran_Linear:"assets/json/FF.Linear.json", //there
			// fran_Linear:"assets/json/FF.Linear.02.json",
			fran_GR_01:"assets/json/FF.GR.01.json",    //there
			fran_GR_02:"assets/json/FF.GR.02.json",
			fran_SmallTk_01:"assets/json/FF.ST.01.json", //there
			fran_SmallTk_02:"assets/json/FF.ST.02.json", //there
			fran_RQ_01:"assets/json/FF.RQ.01.json",
			fran_RQ_02:"assets/json/FF.RQ.02.json",     //there
			// Luna
			luna_01: "assets/json/LL.STwGr.01.json",      //there
			luna_02: "assets/json/LL.STwGR.02.json",      //there
			// Mike
			mike_Linear:"assets/json/MM.Linear.json",     //there
			// mike_Linear_positive:"assets/json/MM.Linear.positive.json", //need to add?

			mike_GR_01:"assets/json/MM.GR.01.json",      //there
			mike_GR_02:"assets/json/MM.GR.02.json",
			mike_SmallTk_01:"assets/json/MM.ST.01.json",   //there
			mike_SmallTk_02:"assets/json/MM.ST.02.json",     //there
			mike_RQ_01:"assets/json/MM.RQ.01.json",        //there
			mike_RQ_02:"assets/json/MM.RQ.02.json",       //there

//new ones
			charly_SmallTalk_02:"assets/json/CC.ST.02.json",
			charly_RQwGr_01:"assets/json/CC.RQwGr.01.json",
			charly_RQ_02:"assets/json/CC.RQ.02.json",
			Luna_RQ_01:"assets/json/LL.RQ.01.json",
			Luna_RQ_02:"assets/json/LL.RQ.02.json"



		};


		// so we can work with the data loaded via spreadsheet...
		for (var dialogKey in dialogJsonPaths) {
			var p = dialogJsonPaths[dialogKey].split('/');
			var jfn = p[p.length-1];
			var worksheetKey = jfn.replace('.json', '');//can remove this
			dialogWorksheetKeys[dialogKey] = worksheetKey;


}//end of for loop


		var deferred = $q.defer();
		service.deferred = deferred;
		service.loadedPromise = deferred.promise;

		//ok so service is an object...
		if (deferred ==="undefined"){
			console.log("!!!UNDEFINED");
		}
		return service;

		function getDialogKeys(){
			return Object.keys(dialogJsonPaths);
		}


		function loadFromServer(gameType) {

			gameType = gameType || "negative";

			var prefix = gameType.split("-")[0];
      $log.log("Loading from url '"+prefix+"' ...");

            return parseAAContentService.parseContentFromGameType(prefix)
                .then(function(parsedContent) {
                    $log.log("Test Loaded from url '"+prefix+"'.");
                    $log.log('Success!');
                    // $log.log(angular.toJson(parsedContent,4));

                })
                .then(function(){
                	$log.log("Take a look at me now!!!");
                	adjustDialogWorksheetKeys();
                	adjustNegativePositiveLinearKeys(gameType);
                	adjustFeedbackAnimations(gameType);
									$log.log(parseAAContentService.parsedContent);
                })
                .catch(function() {$log.log('! did not work _ Falling back to JSON files');}
                );

        }

        // becuase the json paths don't actually line up with the damn worksheet keys... grrrrr.....!!!
        function adjustDialogWorksheetKeys() {

        	var casedKeyMap = Object.keys(parseAAContentService.parsedContent)
        						.reduce(function(acc, wsKey) { acc[wsKey.toUpperCase()] = wsKey; return acc;}, {});
        	var adjustedKeys = {};
        	for (var dialogKey in dialogWorksheetKeys) {
        		adjustedKeys[dialogKey] = casedKeyMap[dialogWorksheetKeys[dialogKey].toUpperCase()];
        	}
        	service.dialogWorksheetKeys = dialogWorksheetKeys = adjustedKeys;

  }
        function adjustNegativePositiveLinearKeys(gameType) {

					var posKeys = "positive";
					var isPositive = gameType.indexOf(posKeys) > -1;
					console.log("!!!is the value gameType "+gameType);
					console.log("!!!is the value postive??? "+isPositive);

					if(isPositive){
						service.dialogWorksheetKeys['fran_Linear'] = 'FF.Linear.positive';
						service.dialogWorksheetKeys['mike_Linear'] = 'MM.Linear.positive';
					}//end of postive check
					else{
							console.log("::negative value");


						}
					 }

        function adjustFeedbackAnimations(gameType) {

          var ispos = getGameType(gameType);
					function chaseTree (node){
						if(!Array.isArray(node)){

							angular.forEach(node , function(subNode){
									chaseTree(subNode );
							})//end of foreach
						}//end of if

					  else{
							angular.forEach(node, function(step){
								if(angular.isUndefined(step.animation)){

								 step.animation = ispos? step.animationPositive: step.animationNegative;
 							 }
						 })//foreach
					}//end of else
				}//end of chasetree

					chaseTree(parseAAContentService.parsedContent);
    }


				function getGameType(gameType){
					var posKeys = "positive";
					var isPositive = gameType.indexOf(posKeys) > -1;
					return isPositive;
				}


		function getDialogs(dialogKey){

			return service.loadedPromise
				.then(function() {
					var spreadsheetContent = parseAAContentService.parsedContent[dialogWorksheetKeys[dialogKey]];
					if (spreadsheetContent) {
						return spreadsheetContent;
					}

					$log.warn(':::Falling back to JSON file "'+dialogJsonPaths[dialogKey]+'"');

					return $http.get(dialogJsonPaths[dialogKey]).then(function(response){
						return response.data;
					});

				});


		}
	}//end of scope of function
})();
