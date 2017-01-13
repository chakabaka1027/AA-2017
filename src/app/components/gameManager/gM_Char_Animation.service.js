(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.service('gM_Animation_Data', gM_Animation_Data);

	/** @ngInject */
	function gM_Animation_Data(){
		var gameCharacterData = {
			annie: {
				animations: {
					"standingDown": ["assets/images/Characters/Annie/Annie-dn5.png"],
					"walkingDown": ["assets/images/Characters/Annie/Annie-dn1.png", "assets/images/Characters/Annie/Annie-dn4.png"],
					"standingUp": ["assets/images/Characters/Annie/Annie-up5.png"],
					"walkingUp": ["assets/images/Characters/Annie/Annie-up1.png","assets/images/Characters/Annie/Annie-up4.png"],
					"talking": ["assets/images/Characters/Annie/Annie-StandR.png"],
					"standingSide": ["assets/images/Characters/Annie/Annie-L5.png"], //initally facing left
					"walkingSide": ["assets/images/Characters/Annie/Annie-L1.png","assets/images/Characters/Annie/Annie-L4.png"]
				}
				//add conversation animations
			},
			mike: {
				animations: {
					"talking": ["assets/images/Characters/Mike/Mike-Stand-Angle-Right.png"]
					// ,"showNPCArrow": []
					// "talking": ["assets/images/Characters/Mike/Mike-Stand-Angle-Left.png","assets/images/Characters/Mike/"],
					// "surprised": ["assets/images/Characters/Mike/Mike-Surprised0001.png","assets/images/Characters/Mike/Mike-Surprised0024.png"]
				}
			},
			fran: {
					animations: {
						"talking": ["assets/images/Characters/Fran/Fran-Angle-Left.png"]
					// ,"showNPCArrow": []

					}
			},
			charlie: {
				animations: {
					"talking": ["assets/images/Characters/Charlie/Charlie-Stand-Angle-Left.png"]
					//, "showNPCArrow": []

				}
			},
			luna: {
				animations: {
					"talking": ["assets/images/Characters/Luna/Luna-Stand-Angle-Right.png"]
					//, "showNPCArrow": []
				}
			}
		}
		return gameCharacterData;
	}
})();
/*
To add more characters
"label": ["assets/images/Characters/"]
Label is the specific name that p5 uses to find the image/animation
*/
