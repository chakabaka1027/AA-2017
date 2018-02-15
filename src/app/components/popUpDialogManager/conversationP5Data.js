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

					"annoyed_mild": ["assets/images/Characters/Charlie/Charlie_Annoyed_Mild.png"],
					"annoyed_bold": ["assets/images/Characters/Charlie/Charlie_Annoyed_Mild.png"],

					"confused_mild": ["assets/images/Characters/Charlie/Charlie_Confused_Mild.png"],
					"confused_bold": ["assets/images/Characters/Charlie/Charlie_Confused_Mild.png"],

					"surprised_mild": ["assets/images/Characters/Charlie/Charlie_Surprised_Mild.png"],
					"surprised_bold": ["assets/images/Characters/Charlie/Charlie_Surprised_Mild.png"],

					"amused_mild": ["assets/images/Characters/Charlie/Charlie_Amused_Mild.png"],
					"amused_bold": ["assets/images/Characters/Charlie/Charlie_Amused_Mild.png"],

					"satisfied_mild": ["assets/images/Characters/Charlie/Charlie_Satisfied_Mild.png"],
					"satisfied_bold": ["assets/images/Characters/Charlie/Charlie_Satisfied_Mild.png"],

					"agree_mild": ["assets/images/Characters/Charlie/Charlie_Agreement_Mild.png"],
					"agree_bold": ["assets/images/Characters/Charlie/Charlie_Agreement_Mild.png"]


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
					"surprised_bold": ["assets/images/Characters/Luna/Luna_Surprised_Mild.png"],

					"amused_mild": ["assets/images/Characters/Luna/Luna_Amused_Mild.png"],
					"amused_bold": ["assets/images/Characters/Luna/Luna_Amused_Mild.png"],

					"satisfied_mild": ["assets/images/Characters/Luna/Luna_Satisfied_Mild.png"],
					"satisfied_bold": ["assets/images/Characters/Luna/Luna_Satisfied_Mild.png"],

					"agree_mild": ["assets/images/Characters/Luna/Luna_Agreement_Mild.png"],
					"agree_bold": ["assets/images/Characters/Luna/Luna_Agreement_Mild.png"]

				}
			},
			stu:{
				positionX: 150,
				positionY: 315,
				animations:{
					"normal": ["assets/images/Characters/Stu/Stu_inset.png"],

					"annoyed_mild": ["assets/images/Characters/Stu/Stu_annoyed_mild.png"],
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
