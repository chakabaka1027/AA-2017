(function(){
	'use strict';

	angular.module('awkwardAnnie')
		.service('conversationP5Data', conversationP5Data);

	/** @ngInject */
	function conversationP5Data(){
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
				animations:{ //TODO !!!new Add other emotions here
					"normal": ["assets/images/Characters/Fran/Fran-Inset-Final.png"],

					//negative emotes
					"surprised_mild": ["assets/images/Characters/Fran/Surprised/Fran_Surprised_Mild.png"],
					"surprised_bold": ["assets/images/Characters/Fran/Surprised/Fran_Surprised_01.png","assets/images/Characters/Fran/Surprised/Fran_Surprised_18.png"],

					"confused_mild": ["assets/images/Characters/Fran/Confused/Fran_Confused_Mild.png"],
					"confused_bold": ["assets/images/Characters/Fran/Confused/Fran_Confused_01.png","assets/images/Characters/Fran/Confused/Fran_Confused_25.png"],

					"annoyed_mild": ["assets/images/Characters/Fran/Annoyed/Fran_Annoyed_Mild.png"],
					"annoyed_bold": ["assets/images/Characters/Fran/Annoyed/Fran_Annoyed_01.png","assets/images/Characters/Fran/Annoyed/Fran_Annoyed_25.png"],

					//positive emotes					"amused_mild": ["assets/images/Characters/Fran/Amused/Fran_Amused_Mild.png"],
					"amused_bold": ["assets/images/Characters/Fran/Amused/Fran_Amused_01.png","assets/images/Characters/Fran/Amused/Fran_Amused_22.png"],

					"satisfied_mild": ["assets/images/Characters/Fran/Satisfied/Fran_Satisfied_Mild.png"],
					"satisfied_bold": ["assets/images/Characters/Fran/Satisfied/Fran_Satisfied_01.png","assets/images/Characters/Fran/Satisfied/Fran_Satisfied_31.png"],

					"agree_mild": ["assets/images/Characters/Fran/Agreement/Fran_Agreement_Mild.png"],
					"agree_bold": ["assets/images/Characters/Fran/Agreement/Fran_Agreement_01.png","assets/images/Characters/Fran/Agreement/Fran_Agreement_22.png"]
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
					"annoyed_bold": ["assets/images/Characters/Mike/Annoyed/Mike_Annoyed_03.png","assets/images/Characters/Mike/Annoyed/Mike_Annoyed_22.png"],

					"amused_mild": ["assets/images/Characters/Mike/Amused/Mike_Amused_Mild.png"],
					"amused_bold": ["assets/images/Characters/Mike/Amused/Mike_Amused_01.png","assets/images/Characters/Mike/Amused/Mike_Amused_20.png"],

					"satisfied_mild": ["assets/images/Characters/Mike/Satisfied/Mike_Satisfied_Mild.png"],
					"satisfied_bold": ["assets/images/Characters/Mike/Satisfied/Mike_Satisfied_01.png","assets/images/Characters/Mike/Satisfied/Mike_Satisfied_26.png"],

					"agree_mild": ["assets/images/Characters/Mike/Agreement/Mike_Agreement_Mild.png"],
					"agree_bold": ["assets/images/Characters/Mike/Agreement/Mike_Agreement_01.png","assets/images/Characters/Mike/Agreement/Mike_Agreement_24.png"]
				}
			},
			charlie:{
				positionX: 150,
				positionY: 325,
				animations:{
					"normal": ["assets/images/Characters/Charlie/Charlie-Inset-Angle-Right.png"],

					"annoyed_mild": ["assets/images/Characters/Charlie/New/Charlie_Annoyed_Mild.png"],
					"annoyed__med":["assets/images/Characters/Charlie/New/Charlie_Annoyed_Med.png"],
					"annoyed_bold": ["assets/images/Characters/Charlie/New/Charlie_Annoyed_Med.png"],

					"confused_mild": ["assets/images/Characters/Charlie/New/Charlie_Confused_Mild.png"],
					"confused_med": ["assets/images/Characters/Charlie/New/Charlie_Confused_Med.png"],
					"confused_bold": ["assets/images/Characters/Charlie/New/Charlie_Confused_Med.png"],

					"surprised_mild": ["assets/images/Characters/Charlie/New/Charlie_Surprised_Mild.png"],
					"surprised_med": ["assets/images/Characters/Charlie/New/Charlie_Surprised_Med.png"],
					"surprised_bold": ["assets/images/Characters/Charlie/New/Charlie_Surprised_Med.png"],

					"amused_mild": ["assets/images/Characters/Charlie/New/Charlie_Amused_Mild.png"],
					"amused_med": ["assets/images/Characters/Charlie/New/Charlie_Amused_Med.png"],
					"amused_bold": ["assets/images/Characters/Charlie/New/Charlie_Amused_Med.png"],

					"satisfied_mild": ["assets/images/Characters/Charlie/New/Charlie_Satisfied_Mild.png"],
					"satisfied_med": ["assets/images/Characters/Charlie/New/Charlie_Satisfied_Med.png"],
					"satisfied_bold": ["assets/images/Characters/Charlie/New/Charlie_Satisfied_Med.png"],

					"agree_mild": ["assets/images/Characters/Charlie/New/Charlie_Annoyed_Mild.png"],
					"agree_med":  ["assets/images/Characters/Charlie/New/Charlie_Agreement_Med.png"],
					"agree_bold":  ["assets/images/Characters/Charlie/New/Charlie_Agreement_Med.png"]


				}
			},
			luna:{
				positionX: 150,
				positionY: 330,
				animations:{
					"normal": ["assets/images/Characters/Luna/Luna-Inset-Angle-Right.png"],

					"annoyed_mild": ["assets/images/Characters/Luna/New/Luna_Annoyed_Mild.png"],
					"annoyed_med": ["assets/images/Characters/Luna/New/Luna_Annoyed_Med.png"],
					"annoyed_bold": ["assets/images/Characters/Luna/New/Luna_Annoyed_Med.png"],

					"confused_mild": ["assets/images/Characters/Luna/New/Luna_Confused_Mild.png"], // as they all play mild..
					"confused_med": ["assets/images/Characters/Luna/New/Luna_Confused_Med.png"], // as they all play mild..
					"confused_bold": ["assets/images/Characters/Luna/New/Luna_Confused_Med.png"], //should i remove bold and set it to new " medium" don't think this is meaningful?
																																	//added them as i DON'T know if there will be new things in the future - otherwise whats the point of having med since its always two..
					"surprised_mild": ["assets/images/Characters/Luna/New/Luna_Surprised_Mild.png"],
					"surprised_med": ["assets/images/Characters/Luna/New/Luna_Surprised_Med.png"],
					"surprised_bold": ["assets/images/Characters/Luna/New/Luna_Surprised_Med.png"],

					"amused_mild": ["assets/images/Characters/Luna/New/Luna_Amused_Mild.png"],
					"amused_med": ["assets/images/Characters/Luna/New/Luna_Amused_Med.png"],
					"amused_bold": ["assets/images/Characters/Luna/New/Luna_Amused_Med.png"],

					"satisfied_mild": ["assets/images/Characters/Luna/New/Luna_Satisfied_Mild.png"],
					"satisfied_med": ["assets/images/Characters/Luna/New/Luna_Satisfied_Med.png"],
					"satisfied_bold": ["assets/images/Characters/Luna/New/Luna_Satisfied_Med.png"],

					"agree_mild": ["assets/images/Characters/Luna/New/Luna_Agreement_Mild.png"],
					"agree_med": ["assets/images/Characters/Luna/New/Luna_Agreement_Med.png"],
					"agree_bold": ["assets/images/Characters/Luna/New/Luna_Agreement_Med.png"]
					//old luna are at the end of the file --- new images have highlits, added them in a new folder just incase we want to revert back

				}
			},
			stu:{
				positionX: 150,
				positionY: 315,
				animations:{
					"normal": ["assets/images/Characters/Stu/Stu_inset.png"],

					"annoyed_mild": ["assets/images/Characters/Stu/Stu_annoyed_mild.png"],
					"annoyed_med": ["assets/images/Characters/Stu/Stu_annoyed_bold.png"],// need to add a check - did you mean med here? would that be a per conversation check
					"annoyed_bold": ["assets/images/Characters/Stu/Stu_annoyed_bold.png"],

					"confused_mild": ["assets/images/Characters/Stu/Stu_confused_mild.png"],
					"confused_bold": ["assets/images/Characters/Stu/Stu_confused_bold.png"],

					"surprised_mild": ["assets/images/Characters/Stu/Stu_surprised_mild.png"],
					"surprised_bold": ["assets/images/Characters/Stu/Stu_surprised_bold.png"],

					"amused_mild": ["assets/images/Characters/Stu/Stu_amused_mild.png"],
					"amused_bold": ["assets/images/Characters/Stu/Stu_amused_bold.png"],

					"satisfied_mild": ["assets/images/Characters/Stu/Stu_satisfied_mild.png"],
					"satisfied_bold": ["assets/images/Characters/Stu/Stu_satisfied_boldpng"],
          //
					"agree_mild": ["assets/images/Characters/Stu/Stu_agree_mild.png"],
					"agree_bold": ["assets/images/Characters/Stu/Stu_agree_bold.png"]


				}
			},
		};
		return conversationP5;
	}
})();

				//
				// "annoyed_mild": ["assets/images/Characters/Charlie/Charlie_Annoyed_Mild.png"],
				// "annoyed_bold": ["assets/images/Characters/Charlie/Charlie_Annoyed_Mild.png"],
				//
				// "confused_mild": ["assets/images/Characters/Charlie/Charlie_Confused_Mild.png"],
				// "confused_bold": ["assets/images/Characters/Charlie/Charlie_Confused_Mild.png"],
				//
				// "surprised_mild": ["assets/images/Characters/Charlie/Charlie_Surprised_Mild.png"],
				// "surprised_bold": ["assets/images/Characters/Charlie/Charlie_Surprised_Mild.png"],
				//
				// "amused_mild": ["assets/images/Characters/Charlie/Charlie_Amused_Mild.png"],
				// "amused_bold": ["assets/images/Characters/Charlie/Charlie_Amused_Mild.png"],
				//
				// "satisfied_mild": ["assets/images/Characters/Charlie/Charlie_Satisfied_Mild.png"],
				// "satisfied_bold": ["assets/images/Characters/Charlie/Charlie_Satisfied_Mild.png"],
				//
				// "agree_mild": ["assets/images/Characters/Charlie/Charlie_Agreement_Mild.png"],
				// "agree_bold": ["assets/images/Characters/Charlie/Charlie_Agreement_Mild.png"]

//				old paths
				// "annoyed_mild": ["assets/images/Characters/Luna/Luna_Annoyed_Mild.png"],
				// "annoyed_bold": ["assets/images/Characters/Luna/Luna_Annoyed_Mild.png"],
				//
				// "confused_mild": ["assets/images/Characters/Luna/Luna_Confused_Mild.png"], // as they all play mild..
				// "confused_bold": ["assets/images/Characters/Luna/Luna_Confused_Mild.png"], //should i remove bold and set it to new " medium" don't think this is meaningful?
				//
				// "surprised_mild": ["assets/images/Characters/Luna/Luna_Surprised_Mild.png"],
				// "surprised_bold": ["assets/images/Characters/Luna/Luna_Surprised_Mild.png"],
				//
				// "amused_mild": ["assets/images/Characters/Luna/Luna_Amused_Mild.png"],
				// "amused_bold": ["assets/images/Characters/Luna/Luna_Amused_Mild.png"],
				//
				// "satisfied_mild": ["assets/images/Characters/Luna/Luna_Satisfied_Mild.png"],
				// "satisfied_bold": ["assets/images/Characters/Luna/Luna_Satisfied_Mild.png"],
				//
				// "agree_mild": ["assets/images/Characters/Luna/Luna_Agreement_Mild.png"],
				// "agree_bold": ["assets/images/Characters/Luna/Luna_Agreement_Mild.png"]
