(function(){
	'use strict';
	
	angular.module('awkwardAnnie')
	.service('userDataService', userDataService);

	/** @ngInject */
	function userDataService($http, $log){
		
		var hostBaseAddress = "awkwardBackend";
		var rowHeaders = [
			"Game Version", "User ID", "Session ID", "Date", "Time (HH:MM:SS)", "GameLevel", "Location", "Action", "Data_1", "Data_2"
		];

		var service = {
			enabled: false, //writes to database
			userID: "player",
			version: "Candidate 1.39",
			sessionID: moment().unix(),

			dataRows: [],

			trackAction: trackAction,

			postData: postData
		};

		return service;

		function trackAction(gameLevel, location, action, data1, data2) {
			var row = [
				service.version,
				service.userID,
				service.sessionID,
				moment().format('M/D/YYYY'),
				moment().format('HH:mm:ss')
			];

			if (data1===undefined || data1 === null) data1 = '';
			if (data2===undefined || data2 === null) data2 = '';

			row = row.concat([gameLevel, location, action, data1, data2]);
			$log.log('Data tracked: '+row.join(','));

			service.dataRows.push(row);

		}

		function postData() {
			var csvRows = [rowHeaders].concat(service.dataRows);

			var csv = "";

			csvRows.forEach(function(row) {
				csv += row.join('\t')+'\n';
			});

			var data = {
				fname: service.userID+'_'+service.sessionID,
				csvData: csv
			};

			if (!service.enabled) {
				$log.log('Would post; but data posting disabled');
			} else {
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