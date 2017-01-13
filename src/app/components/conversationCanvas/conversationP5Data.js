(function(){
	'use strict';
	
	angular.module('awkwardAnnie')
	.service('conversationP5Data', conversationP5Data);

	/** @ngInject */
	function conversationP5Data(){
		//return everything and have the controller .then()
		//will have to change based on what character is bumped into
		var conversationP5 = {
			annie:{
				positionX: 455,
				positionY: 300,
				animations:{
					"annie_normal": ["assets/images/Characters/Annie/annie_inset.png"]
				}
			},
			fran:{
				positionX: 155,
				positionY: 325,
				animations:{
					"normal": ["assets/images/Characters/Fran/Fran-Inset-Final.png"],
					"surprised_mild": ["assets/images/Characters/Fran/Surprised/Fran_Surprised_Mild.png"],
					"surprised_bold": ["assets/images/Characters/Fran/Surprised/Fran_Surprised_01.png","assets/images/Characters/Fran/Surprised/Fran_Surprised_18.png"],

					"confused_mild": ["assets/images/Characters/Fran/Confused/Fran_Confused_Mild.png"],
					"confused_bold": ["assets/images/Characters/Fran/Confused/Fran_Confused_01.png","assets/images/Characters/Fran/Confused/Fran_Confused_25.png"],

					"annoyed_mild": ["assets/images/Characters/Fran/Annoyed/Fran_Annoyed_Mild.png"],
					"annoyed_bold": ["assets/images/Characters/Fran/Annoyed/Fran_Annoyed_01.png","assets/images/Characters/Fran/Annoyed/Fran_Annoyed_25.png"]
				}
			},
			mike:{
				positionX: 150,
				positionY: 315,
				animations:{
					"normal": ["assets/images/Characters/Mike/Mike_Inset_FINAL.png"],
					"surprised_mild": ["assets/images/Characters/Mike/Surprised/Mike_Surprised_mild.png"],
					"surprised_bold": ["assets/images/Characters/Mike/Surprised/Mike_Surprised_01.png","assets/images/Characters/Mike/Surprised/Mike_Surprised_17.png"],

					"confused_mild": ["assets/images/Characters/Mike/Confused/Mike-Confused-Mild.png"],
					"confused_bold": ["assets/images/Characters/Mike/Confused/Mike_Confused_01.png","assets/images/Characters/Mike/Confused/Mike_Confused_23.png"],

					"annoyed_mild": ["assets/images/Characters/Mike/Annoyed/Mike_Annoyed_Mild.png"],
					"annoyed_bold": ["assets/images/Characters/Mike/Annoyed/Mike_Annoyed_03.png","assets/images/Characters/Mike/Annoyed/Mike_Annoyed_22.png"]
				}
			},
			// Currently no bold animations for NPCs
			charlie:{
				positionX: 150,
				positionY: 325,
				animations:{
					"normal": ["assets/images/Characters/Charlie/Charlie-Inset-Angle-Right.png"],
					"annoyed_mild": ["assets/images/Characters/Charlie/Charlie_Annoyed_Mild.png"],
					"annoyed_bold": ["assets/images/Characters/Charlie/Charlie_Annoyed_Mild.png"],
					
					"confused_mild": ["assets/images/Characters/Charlie/Charlie_Confused_Mild.png"],
					"confused_bold": ["assets/images/Characters/Charlie/Charlie_Confused_Mild.png"],
					
					"surprised_mild": ["assets/images/Characters/Charlie/Charlie_Surprised_Mild.png"],
					"surprised_bold": ["assets/images/Characters/Charlie/Charlie_Surprised_Mild.png"]
				}
			},
			luna:{
				positionX: 150,
				positionY: 330,
				animations:{
					"normal": ["assets/images/Characters/Luna/Luna-Inset-Angle-Right.png"],
					"annoyed_mild": ["assets/images/Characters/Luna/Luna_Annoyed_Mild.png"],
					"annoyed_bold": ["assets/images/Characters/Luna/Luna_Annoyed_Mild.png"],

					"confused_mild": ["assets/images/Characters/Luna/Luna_Confused_Mild.png"],
					"confused_bold": ["assets/images/Characters/Luna/Luna_Confused_Mild.png"],

					"surprised_mild": ["assets/images/Characters/Luna/Luna_Surprised_Mild.png"],
					"surprised_bold": ["assets/images/Characters/Luna/Luna_Surprised_Mild.png"]
				}
			}
		};
		return conversationP5;
	}
})();