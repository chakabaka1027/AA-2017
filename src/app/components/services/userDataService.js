(function(){
	'use strict';

	angular.module('awkwardAnnie')
	.service('userDataService', userDataService);

	/** @ngInject */
	function userDataService($http, $log  ){

		//weird doesnt pass it - gives me an undefined value -- ( unlessI include evrything here - had the same issue with instructions before )

		var hostBaseAddress = "awkwardBackend";
		var rowHeaders = [
			"Game Version", "User ID", "Session ID", "Date", "Time (HH:MM:SS)", "GameLevel", "Location", "Action", "Data_1", "Data_2"
		];

		var service = {
			enabled: true, //writes to database
			userID: "player",
			version: "AAv2.98",
		  gameType: " ",
			sessionID: moment().unix(),
			dataRows: [],
			trackAction: trackAction,
			postData: postData,
			resetData: resetData
		};

		return service;

		function resetData() {
			service.dataRows = [];
			service.sessionID = moment().unix();
		}

		function trackAction(gameLevel, location, action, data1, data2) {
			var row = [
				service.version+':'+service.gameType,
				service.userID,
				service.sessionID,
				moment().format('M/D/YYYY'),
				moment().format('HH:mm:ss')
			];

			if (angular.isUndefined(data1) || data1 === null) data1 = '';
			if (angular.isUndefined(data2) || data2 === null) data2 = '';

			row = row.concat([gameLevel, location, action, data1, data2]);
			service.dataRows.push(row);

		}
		function postData() {
			var csvRows = [rowHeaders].concat(service.dataRows);

			var csv = "";

			csvRows.forEach(function(row) {
				csv += row.join('\t')+'\n';
			});

			var data = {
				fname: service.userID+'_'+ service.gameType+'_'+service.sessionID,
				csvData: csv //rows in csv format - posted to a csv file
				// talks to php -
				//url and what protocol
			};

			if (!service.enabled) {
				$log.log('Would post; but data posting disabled');
			} else {
				// url and what data they want ? json and userid_ sucsess true

				var url = hostBaseAddress+'/awkwardData.php';
				$log.log('Posting to: '+hostBaseAddress+'/data/'+data.fname+'.csv');
				$http.post(url, data)
					.then(function(response) {
						$log.log('Success writing data!');
					},
					function() {
						$log.log('Failure writing data!');
					});
			}
		}

	}


})();
