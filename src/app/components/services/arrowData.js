(function(){
	'use strict';
	
	angular.module('awkwardAnnie')
	.service('arrowData', arrowData);

	/** @ngInject */
	function arrowData(){
		var service = {
			top_left_door:{
				x:110, y:115,
				arrowImage:{
					hasDialog: "dialogUpArrow",
					noDialog: "upArrow"
				}
			},
			top_right_door:{
				x:770, y:115,
				arrowImage:{
					hasDialog: "dialogUpArrow",
					noDialog: "upArrow"
				}
			},
			left_door:{
				x:20, y:310,
				arrowImage:{
					hasDialog: "dialogLeftArrow",
					noDialog: "leftArrow"
				}
			},
			right_door:{
				x:830, y:310,
				arrowImage:{
					hasDialog: "dialogRightArrow",
					noDialog: "rightArrow"
				}
			},
			lower_left_door:{
				x:110, y:400,
				arrowImage:{
					hasDialog: "dialogDownArrow",
					noDialog: "downArrow"
				}
			},
			lower_right_door:{
				x:700, y:400,
				arrowImage:{
					hasDialog: "dialogDownArrow",
					noDialog: "downArrow"
				}
			}
		}
		return service;
	}
})();
