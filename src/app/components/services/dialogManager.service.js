(function(){
	'use strict';
	
	angular.module('importContent')
	.service('dialogService', dialogContentService);

	// how to use it
	// service.getDialogs("LinearMike");

	/** @ngInject */
	function dialogContentService($log, $http, $q, parseAAContentService, $timeout){
        var defaultUrl = 'assets/AwkwardAnnieDialogContent_negative.xlsx';

		var dialogWorksheetKeys = {};

		var service = {
			getDialogs: getDialogs,
			getDialogKeys: getDialogKeys,
			dialogWorksheetKeys: dialogWorksheetKeys
		};

		var dialogJsonPaths = {
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


		// so we can work with the data loaded via spreadsheet...
		for (var dialogKey in dialogJsonPaths) {
			var p = dialogJsonPaths[dialogKey].split('/');
			var jfn = p[p.length-1];
			var worksheetKey = jfn.replace('.json', '');
			dialogWorksheetKeys[dialogKey] = worksheetKey;
		}

		var deferred = $q.defer();
		service.loadedPromise = deferred.promise;
		//$log.log("creating timeout")

		$timeout(function(){ 
		//$log.log("actually loading xlsx")
			deferred.resolve(loadFromServer());
		}, 500)

		return service;

		function getDialogKeys(){
			return Object.keys(dialogJsonPaths);
		}

		function loadFromServer() {

            $log.log("Loading from url '"+defaultUrl+"' ...");

            return parseAAContentService.parseContentFromUrl(defaultUrl)
                .then(function(parsedContent) {
                    $log.log("Loaded from url '"+defaultUrl+"'.");
                    $log.log('Success!');
                    $log.log(parsedContent);
                })
                .then(function(){
                	$log.log("Take a look at me now!!!")
                	adjustDialogWorksheetKeys();
                })
                .catch(function() {$log.log('Falling back to JSON files');}
                );

        }

        // becuase the json paths don't actually line up with the damn worksheet keys... grrrrr.....!!!
        function adjustDialogWorksheetKeys() {
        	var casedKeyMap = Object.keys(parseAAContentService.parsedContent)
        						.reduce(function(acc, wsKey) { acc[wsKey.toUpperCase()] = wsKey; return acc;}, {});
        	$log.log(casedKeyMap);
        	var adjustedKeys = {};
        	for (var dialogKey in dialogWorksheetKeys) {
        		adjustedKeys[dialogKey] = casedKeyMap[dialogWorksheetKeys[dialogKey].toUpperCase()];
        	}
        	service.dialogWorksheetKeys = dialogWorksheetKeys = adjustedKeys;
        }

		function getDialogs(dialogKey){

			return service.loadedPromise
				.then(function() {
					var spreadsheetContent = parseAAContentService.parsedContent[dialogWorksheetKeys[dialogKey]];
					if (spreadsheetContent) {
						return spreadsheetContent;
					}

					$log.warn('Falling back to JSON file "'+dialogJsonPaths[dialogKey]+'"');

					return $http.get(dialogJsonPaths[dialogKey]).then(function(response){
						return response.data;
					});

				});

			/*
			var spreadsheetContent = parseAAContentService.parsedContent[dialogWorksheetKeys[dialogKey]];
			if (spreadsheetContent) {
				// it's been loaded from a spreadsheet...
				var deferred = $q.defer();
				deferred.resolve(spreadsheetContent);
				return deferred.promise;
			}
			$log.log("Falling Back to JSON");

			return $http.get(dialogJsonPaths[dialogKey]).then(function(response){
				return response.data;
			});
			*/

		}
	}
})();