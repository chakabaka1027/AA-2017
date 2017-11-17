(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('chastest', chastest)
		.service('DialogNode', dialogNode);

	/** @ngInject */
	function chastest($log, parseAAContentService, DialogNode) {
		return {
			restrict: 'E',
			controller: controller
		};

		function controller($scope) {
			/*
			parseAAContentService.parseContentFromGameType('positive')
				.then(function() {
					$log.log(parseAAContentService.parsedContent);

					$log.log(angular.toJson(parseAAContentService.parsedContent['FF.RQ.01'], 4));

					var a = new DialogNode('A', false);
					a.addChild(new DialogNode('AB', true))
					a.addChild(new DialogNode('AC'), false);
				});
			*/
			
			var foo = new DialogNode('ABC');
		}
	}

	/** @ngInject */
	function dialogNode($log) {

		function DialogNode(code, isFinal) {
			this.code = code;
			this.choiceCode = code[code.length-1]
			this.isFinal = isFinal;
			this.children = {};
			this.pcText;
			this.npcText;
		}

		var p = DialogNode.prototype;

		p.addChild = function(childNode) {
			this.children[childNode.choiceCode] = childNode;
		}

		/*

		var curNode;

		<div ng-repeat="child in curChild.children...">
			<child.npcText ng-click="selecyChild(child.choiceCode)"
		</div<
		...

		curNode = curNode.children[choiceCode];



		*/

		return DialogNode;

	}


	var testFFRQ01 = {
	    "node1": [
	        {
	            "code": "A",
	            "PC_Text": "Can I borrow your extra mug?",
	            "NPC_Response": "No problem!",
	            "animationNegative": "",
	            "animationPositive": "agree_mild"
	        },
	        {
	            "code": "B",
	            "PC_Text": "Can you swing by the cafeteria in the morning and buy me a muffin?",
	            "NPC_Response": "I guess...",
	            "animationNegative": "",
	            "animationPositive": ""
	        },
	        {
	            "code": "C",
	            "PC_Text": "Can you show me your paycheck?",
	            "NPC_Response": "What?!",
	            "animationNegative": "surprised_mild",
	            "animationPositive": ""
	        }
	    ],
	    "node2": {
	        "A": [
	            {
	                "code": "AA",
	                "PC_Text": "I forgot mine and I can't start my day without a hot cup of tea! Can I have one of your herbal teas?",
	                "NPC_Response": "Sure, you should try a green tea. The caffeine will help if you're tired!",
	                "animationNegative": "",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "AB",
	                "PC_Text": "Great! And can I share your slice of coffee cake? I know you've always got one hidden for your morning snack!",
	                "NPC_Response": "I guess you can have a bite.",
	                "animationNegative": "",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "AC",
	                "PC_Text": "Thanks! Can you drive to Coffee Max and buy me a cappuccino? Just use your mug- I don't trust their travel cups.",
	                "NPC_Response": "What's wrong with their cups?",
	                "animationNegative": "confused_mild",
	                "animationPositive": ""
	            }
	        ],
	        "B": [
	            {
	                "code": "BA",
	                "PC_Text": "When you go, can you also grab me a coffee? I'm sorry to ask but you know I am always running late in the mornings!",
	                "NPC_Response": "Alright, Annie. Is that all? I know you are not a morning person!",
	                "animationNegative": "",
	                "animationPositive": "amused_mild"
	            },
	            {
	                "code": "BB",
	                "PC_Text": "And could you try to come in a little before 9am to get me the muffin? I can't be late for my meeting. I'm useless without my morning sugar rush!",
	                "NPC_Response": "I guess I could leave a bit earlier than normal.",
	                "animationNegative": "annoyed_mild",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "BC",
	                "PC_Text": "Since you're already buying breakfast, would you stop at the Starbucks around the corner instead? I definitely prefer their coffee!",
	                "NPC_Response": "Jeez, Annie. Why don't you go yourself?",
	                "animationNegative": "confused_mild",
	                "animationPositive": ""
	            }
	        ],
	        "C": [
	            {
	                "code": "CA",
	                "PC_Text": "Would you mind showing me your paycheck? I have some questions about mine.",
	                "NPC_Response": "That sounds like a Human Resources issue.",
	                "animationNegative": "",
	                "animationPositive": "amused_mild"
	            },
	            {
	                "code": "CB",
	                "PC_Text": "Can't you let me just take a peek?  I want to compare how much we make!",
	                "NPC_Response": "Annie, that's personal information. I don't want to discuss money with you.",
	                "animationNegative": "annoyed_mild",
	                "animationPositive": ""
	            },
	            {
	                "code": "CC",
	                "PC_Text": "I need to know how much you get paid so I know what to ask for when I ask for a raise.",
	                "NPC_Response": "Isn't it a bit premature to be thinking about a raise?",
	                "animationNegative": "confused_mild",
	                "animationPositive": ""
	            }
	        ]
	    },
	    "node3": {
	        "AA": [
	            {
	                "code": "AAA",
	                "PC_Text": "Oh that would be great. Could I try the pomegranate green tea that you love? It sounds exotic!",
	                "NPC_Response": "Sure, it's one of my favorites!",
	                "animationNegative": "",
	                "animationPositive": "agree_bold"
	            },
	            {
	                "code": "AAB",
	                "PC_Text": "Could you make me a cup? You're so much better at pouring hot drinks than me. And make sure to check the brewing time!",
	                "NPC_Response": "I'm not sure it requires much expertise but if you really want...",
	                "animationNegative": "",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "AAC",
	                "PC_Text": "You're right. I am exhausted and a tea won't cut it. Can you run down to Coffee Max and buy me a triple espresso?",
	                "NPC_Response": "That's not at all what I meant!",
	                "animationNegative": "",
	                "animationPositive": "amused_mild"
	            }
	        ],
	        "AB": [
	            {
	                "code": "ABA",
	                "PC_Text": "It looks delicious. Could you share your recipe with me? I would love to try and make it at home!",
	                "NPC_Response": "No problem. It's a great recipe my grandmother taught me!",
	                "animationNegative": "",
	                "animationPositive": "agree_bold"
	            },
	            {
	                "code": "ABB",
	                "PC_Text": "I know how much you need your morning cake fix. Could you bring in an extra slice for me tomorrow instead?",
	                "NPC_Response": "Sure. I'll bring some for you.",
	                "animationNegative": "",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "ABC",
	                "PC_Text": "Can I have half? You don't need the extra calories. You know it's mostly butter anyway!",
	                "NPC_Response": "That's not very nice!",
	                "animationNegative": "",
	                "animationPositive": ""
	            }
	        ],
	        "AC": [
	            {
	                "code": "ACA",
	                "PC_Text": "I prefer my own mug- it's more ecofriendy than the disposable ones. So would you mind grabbing me a coffee if you're going there?",
	                "NPC_Response": "Sure, I was heading there anyway.",
	                "animationNegative": "",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "ACB",
	                "PC_Text": "They're made of plastic- no thanks! You know I'm allergic. Could you buy me a travel mug so I don't have this problem again?",
	                "NPC_Response": "I don't think you are... And why can't you buy yourself a mug?",
	                "animationNegative": "",
	                "animationPositive": ""
	            },
	            {
	                "code": "ACC",
	                "PC_Text": "Their handles are weird! Can you buy us a fancy espresso machine for the office so I don't have to go out for a coffee every time? You make more money than me.",
	                "NPC_Response": "Are you kidding? And what makes you think you know my salary?",
	                "animationNegative": "surprised_bold",
	                "animationPositive": ""
	            }
	        ],
	        "BA": [
	            {
	                "code": "BAA",
	                "PC_Text": "That should be enough. I'll pay you back.  Would you mind taking my loyalty card so I get the points?",
	                "NPC_Response": "Sure, Annie. I wouldn't want you to miss out on a free coffee!",
	                "animationNegative": "",
	                "animationPositive": "amused_mild"
	            },
	            {
	                "code": "BAB",
	                "PC_Text": "That should be plenty. And you still owe me from that time I paid for your coffee so can you just pay? And make it a double.",
	                "NPC_Response": "Fine, Annie. If that's how you want to do it.",
	                "animationNegative": "",
	                "animationPositive": "agree_mild"
	            },
	            {
	                "code": "BAC",
	                "PC_Text": "Thanks! You still owe me from that time in high school when I lent you $2 for lunch. So can you buy me two muffins and a cookie? Then we'll be even!",
	                "NPC_Response": "That's quite the memory you've got, Annie.",
	                "animationNegative": "",
	                "animationPositive": ""
	            }
	        ],
	        "BB": [
	            {
	                "code": "BBA",
	                "PC_Text": "You're the best! If you don't mind, can you bring me a stack of napkins? I am always getting crumbs everywhere!",
	                "NPC_Response": "Oh, I know... As usual it's Fran's delivery at your service!",
	                "animationNegative": "",
	                "animationPositive": "agree_bold"
	            },
	            {
	                "code": "BBB",
	                "PC_Text": "Great! Can you make sure it's a chocolate chip muffin? They can heat one up for you if you wait. It only takes 10 minutes.",
	                "NPC_Response": "I don't know if I will have the time, Annie. Isn't there another flavor that you like?",
	                "animationNegative": "",
	                "animationPositive": ""
	            },
	            {
	                "code": "BBC",
	                "PC_Text": "And can you make sure the coffee is a double tall half cap frap no foam venti on the rocks? It takes 20 minutes to make so get there early.",
	                "NPC_Response": "What kind of drink is that?! I think you're a little confused. I'll just get you a cappuccino.",
	                "animationNegative": "confused_bold",
	                "animationPositive": ""
	            }
	        ],
	        "BC": [
	            {
	                "code": "BCA",
	                "PC_Text": "You're probably right - I should just go myself. Could you tell Mike I might be a few minutes late? There's always a line!",
	                "NPC_Response": "Sure. But since you're going to Starbucks, can you pick me up a muffin too?",
	                "animationNegative": "",
	                "animationPositive": ""
	            },
	            {
	                "code": "BCB",
	                "PC_Text": "I can't. I hurt my ankle jumping on my bed this morning. Could you help me get to work? I need to lean on someone while I hop along.",
	                "NPC_Response": "How old are you, Annie?  Don't you have crutches from the last time this happened?",
	                "animationNegative": "surprised_mild",
	                "animationPositive": ""
	            },
	            {
	                "code": "BCC",
	                "PC_Text": "I'm afraid of that barista with the weird eyes who looks at me funny. Could you ask to borrow his glasses? I think they have x-ray vision!",
	                "NPC_Response": "You've been watching way too many superhero films!",
	                "animationNegative": "surprised_bold",
	                "animationPositive": ""
	            }
	        ],
	        "CA": [
	            {
	                "code": "CAA",
	                "PC_Text": "You're right, thanks Fran. Could you send me their number again? I keep losing it. That's why they call me Absent-Minded Annie!",
	                "NPC_Response": "You think that's what they call you? Uh, sure. I can send you their number again.",
	                "animationNegative": "",
	                "animationPositive": "amused_bold"
	            },
	            {
	                "code": "CAB",
	                "PC_Text": "Can you go with me at lunch?  I'm afraid to walk down that hallway by myself. I am pretty sure it's haunted.",
	                "NPC_Response": "Oh, Annie. Of course it's not haunted! I told you that was Paul from accounting. He's just very pale.",
	                "animationNegative": "",
	                "animationPositive": ""
	            },
	            {
	                "code": "CAC",
	                "PC_Text": "If I write my questions down, can you take them to Human Resources for me?  You're so much better at negotiating and I want a higher salary.",
	                "NPC_Response": "Are you serious? No way, Annie! I can't ask for you to get a raise! That would be completely inappropriate.",
	                "animationNegative": "annoyed_bold",
	                "animationPositive": ""
	            }
	        ],
	        "CB": [
	            {
	                "code": "CBA",
	                "PC_Text": "You're probably right, Fran. Can I at least know how many vacation days you get? I wonder if that's standard for everyone.",
	                "NPC_Response": "Well, I have 3 weeks of vacation. Don't worry. I think it's the same for everyone!",
	                "animationNegative": "",
	                "animationPositive": ""
	            },
	            {
	                "code": "CBB",
	                "PC_Text": "But we're best friends, right? We share everything! Could you just tell me a salary range at least? So I have an idea...",
	                "NPC_Response": "I'd rather not but I am sure you are making a good salary, Annie. Acme Tech is a fair company!",
	                "animationNegative": "annoyed_mild",
	                "animationPositive": ""
	            },
	            {
	                "code": "CBC",
	                "PC_Text": "Come on, Fran! Can you just send me a copy of your last paycheck? I want to use it for leverage to negotiate a raise!",
	                "NPC_Response": "Absolutely not! Then we will both get in trouble. Besides, you just started here. Give it time!",
	                "animationNegative": "annoyed_bold",
	                "animationPositive": ""
	            }
	        ],
	        "CC": [
	            {
	                "code": "CCA",
	                "PC_Text": "You're right.  I should probably wait a month before asking. Could you help me come up with a good argument for it?",
	                "NPC_Response": "That's not what I meant.  I think you should probably put in some good work here before you ask for a raise!",
	                "animationNegative": "surprised_mild",
	                "animationPositive": ""
	            },
	            {
	                "code": "CCB",
	                "PC_Text": "Early bird catches the worm!  I need your help though. Could you write up some ideas for me to present to Mike? You know him so well!",
	                "NPC_Response": "I'm not going to write that for you! I really think you should wait until you have worked here for a while before asking for a raise!",
	                "animationNegative": "annoyed_mild",
	                "animationPositive": ""
	            },
	            {
	                "code": "CCC",
	                "PC_Text": "You're right! Gotta set the mood first! Could you talk to Mike about my amazing personality while I bake some of my world famous brownies?",
	                "NPC_Response": "I don't think brownies are going to help and I am not going to sweet talk Mike for you so you can ask for a raise!",
	                "animationNegative": "annoyed_bold",
	                "animationPositive": ""
	            }
	        ]
	    }
	};

})();
