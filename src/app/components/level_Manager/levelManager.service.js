(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.service('levelDataHandler', levelDataHandler);


	/** @ngInject */
	function levelDataHandler($log, $stateParams){
		var service = {
			choiceScores: {A: 0, B: 3, C: 5},
			successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
			legalLevels: ['negative', 'negative-set1', 'negative-set4', 'positive', 'positive-set1', 'positive-set3'],
			maxLevel: 7,
		//FULL GAME POS AND NEG
			level_1: {  /*~~~~~~~~~~~~~~~~~~~~~~ONE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['fran_Linear'],
				startingRoom: "lobby",
				rooms: {
					lobby:{
						characters: {
							fran:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "fran_Linear"
							}
						}
					},
					conferenceRoom:{
						characters:{
							mike:{}
						}
					},
					anniesOffice:{
						characters:{}
					},
					mikesOffice:{
						characters:{}
					},
					fransOffice:{
						characters:{}
					},
					breakRoom:{
						characters:{
							charlie:{},
							luna:{}
						}
					}
				}
			},
			level_2:{ /*~~~~~~~~~~~~~~~~~~~~~~TWO~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['fran_SmallTk_01'],
				startingRoom: "conferenceRoom",
				rooms: {
					lobby:{
						characters: {
							fran:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "fran_SmallTk_01"
							}
						}
					},
					conferenceRoom:{
						characters:{
							mike:{}
						}
					},
					anniesOffice:{
						characters:{}
					},
					mikesOffice:{
						characters:{}
					},
					fransOffice:{
						characters:{}
					},
					breakRoom:{
						characters:{
							charlie:{},
							luna:{}
						}
					}
				}
			},
			level_3:{ /*~~~~~~~~~~~~~~~~~~~~~~THREE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['mike_Linear', 'mike_GR_01'],
				startingRoom: "lobby",
				rooms: {
						lobby:{
							characters:{}
						},
						conferenceRoom:{
							characters:{
								mike:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "mike_Linear",
									secondConvo:{
										successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
										dialogKey: "mike_GR_01"
									}
								}
							}
						},
						anniesOffice:{
							characters:{}
						},
						mikesOffice:{
							characters:{}
						},
						fransOffice:{
							characters:{
								fran:{}
							}
						},
						breakRoom:{
							characters:{
								charlie:{},
								luna:{}
							}
						}
					}
			},
			level_4:{ /*~~~~~~~~~~~~~~~~~~~~~~FOUR~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				//added LL.STwGr.01 : luna_01
				requiredConversations: ['mike_GR_02', 'fran_GR_01','fran_RQ_01','charlie_01', 'luna_01'],
				rooms: {
					lobby:{
						characters:{}
					},
					conferenceRoom:{
						characters:{}
					},
					anniesOffice:{
						characters:{}
					},
					mikesOffice:{
						characters:{
							mike:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "mike_GR_02"
							}
						}
					},
					fransOffice:{
						characters:{
							fran:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "fran_GR_01",
								secondConvo:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "fran_RQ_01"
								}
							}
						}
					},
					breakRoom:{
						characters:{
							charlie:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "charlie_01"
							},
							luna:{ //added these two
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "luna_01"
							}
						}
					}
				}
			},
			level_5:{ /*~~~~~~~~~~~~~~~~~~~~~~FIVE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				// added CC.RQwGR.01 = ta;led to chatly - //luna01 doesnt play - does it have to do with max levels?
				requiredConversations: ['mike_SmallTk_01', 'mike_RQ_01', 'fran_GR_02', 'luna_01', 'charly_RQwGr_01'],
				rooms:{
					lobby:{
						characters:{}
					},
					conferenceRoom:{
						characters:{}
					},
					anniesOffice:{
						characters:{}
					},
					mikesOffice:{
						characters: {
							mike:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "mike_SmallTk_01",
								secondConvo:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "mike_RQ_01"
								}
							}
						}
					},
					fransOffice:{
						characters:{
							fran:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "fran_GR_02"
							}
						}
					},
					breakRoom:{
						characters:{
							charlie:{ //added values below
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey:"charly_RQwGr_01"
							},
							luna:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "luna_01"
							}
						}
					}
				}
			},
			level_6:{ /*~~~~~~~~~~~~~~~~~~~~~~SIX~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['mike_SmallTk_02', 'fran_SmallTk_02', 'charly_RQ_02', 'Luna_RQ_01'],
				//charly_RQ_02 --- replaced charly and changed luna to Luna_RQ_01
				startingRoom: "lobby",
				rooms:{
					lobby:{
						characters:{}
					},
					conferenceRoom:{
						characters:{}
					},
					anniesOffice:{
						characters:{}
					},
					mikesOffice:{
						characters: {
							mike:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "mike_SmallTk_02"
							}
						}
					},
					fransOffice:{
						characters:{
							fran:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "fran_SmallTk_02"
							}
						}
					},
					breakRoom:{
						characters:{
							charlie:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "charly_RQ_02"
							},
							luna:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "Luna_RQ_01"
							}
						}
					}
				}
			},
			level_7:{ /*~~~~~~~~~~~~~~~~~~~~~~SEVEN~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['mike_RQ_02', 'fran_RQ_02', 'charly_SmallTalk_02', 'LL.RQ.02'],
				//added charly_SmallTalk_02 //LL.RQ.02
				startingRoom: "lobby",
				rooms:{
					lobby:{
						characters:{}
					},
					conferenceRoom:{
						characters:{}
					},
					anniesOffice:{
						characters:{}
					},
					mikesOffice:{
						characters: {
							mike:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "mike_RQ_02"
							}
						}
					},
					fransOffice:{
						characters:{
						}
					},
					breakRoom:{
						characters:{
							fran:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "fran_RQ_02"
							},
							charlie:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey:"charly_SmallTalk_02"
							},
							luna:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey:"LL.RQ.02"
							}
						}
					}
				}
			},

			setUpForGameType: setUpForGameType,
			getRoomDialogs: getRoomDialogs,
			getSuccessPaths: getSuccessPaths,
			fixDamnSuccessPaths: fixDamnSuccessPaths


		};

		var otherLevels = {
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~AA – Positive – Set 1, A – Negative – Set 1~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			'positive-set1':{
				level_1:{ /*~~~~~~~~~~~~~~~~~~~~~~ONE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
					requiredConversations: ['mike_SmallTk_02', 'fran_RQ_02', 'charlie_01', 'Luna_RQ_01'],
					startingRoom: "lobby",
					rooms:{
						lobby:{
							characters:{
								fran:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "fran_RQ_02"
								}
							}
						},
						conferenceRoom:{
							characters:{}
						},
						anniesOffice:{
							characters:{}
						},
						mikesOffice:{
							characters: {
								mike:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "mike_SmallTk_02"
								}
							}
						},
						fransOffice:{
							characters:{
							}
						},
						breakRoom:{
							characters:{
								charlie:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "charlie_01"
								},
								luna:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "Luna_RQ_01"
								}
							}
						}
					}
				}
			},

			'negative-set1':{
				level_1:{ /*~~~~~~~~~~~~~~~~~~~~~~ONE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
					requiredConversations: ['mike_SmallTk_02', 'fran_RQ_02', 'charlie_01', 'Luna_RQ_01'],
					startingRoom: "lobby",
					rooms:{
						lobby:{
							characters:{
								fran:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "fran_RQ_02"
								}
							}
						},
						conferenceRoom:{
							characters:{}
						},
						anniesOffice:{
							characters:{}
						},
						mikesOffice:{
							characters: {
								mike:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "mike_SmallTk_02"
								}
							}
						},
						fransOffice:{
							characters:{
							}
						},
						breakRoom:{
							characters:{
								charlie:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "charlie_01"
								},
								luna:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "Luna_RQ_01"
								}
							}
						}
					}
				}
			},


			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~AA – Positive – Set 3~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			'positive-set3':{
				level_1:{ /*~~~~~~~~~~~~~~~~~~~~~~ONE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
					requiredConversations: ['mike_RQ_02', 'fran_SmallTk_02', 'charlie_02', 'luna_01'],
					startingRoom: "lobby",
					rooms:{
						lobby:{
							characters:{
								fran:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "fran_SmallTk_02"
								}
							}
						},
						conferenceRoom:{
							characters:{}
						},
						anniesOffice:{
							characters:{}
						},
						mikesOffice:{
							characters: {
								mike:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "mike_RQ_02"
								}
							}
						},
						fransOffice:{
							characters:{
							}
						},
						breakRoom:{
							characters:{
								charlie:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "charlie_02"
								},
								luna:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "luna_01"
								}
							}
						}
					}
				}
			},
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~AA – Negative – Set 4~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			'negative-set4':{
				level_1:{ /*~~~~~~~~~~~~~~~~~~~~~~ONE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ //charly_SmallTalk_02charlie_02
					requiredConversations: ['mike_RQ_01', 'fran_SmallTk_01', 'charlie_02', 'luna_02'], //changed luna_02
					startingRoom: "lobby",
					rooms:{
						lobby:{
							characters:{
								fran:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "fran_SmallTk_01"
								}
							}
						},
						conferenceRoom:{
							characters:{}
						},
						anniesOffice:{
							characters:{}
						},
						mikesOffice:{
							characters: {
								mike:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "mike_RQ_01"
								}
							}
						},
						fransOffice:{
							characters:{
							}
						},
						breakRoom:{
							characters:{
								charlie:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "charlie_02"
								},
								luna:{
									successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
									dialogKey: "luna_02"
								}
							}
						}
					}
				}
			}
		};
		return service;

		function setUpForGameType(gameType){
			if(gameType == 'negative'){
				return;
			}
			if(gameType == 'positive'){
				service.successPaths = ["CAA", "ACA", "AAC", "BBA", "BAB", "ABB", "BAA", "ABA", "AAB", "AAA"];
				service.choiceScores = {A: 5, B: 3, C: 0};
				return;
			}

			service.maxLevel = 1;
			if(gameType.indexOf("positive") === 0){
				service.successPaths = ["CAA", "ACA", "AAC", "BBA", "BAB", "ABB", "BAA", "ABA", "AAB", "AAA"];
				service.choiceScores = {A: 5, B: 3, C: 0};
			}
			service.level_1 = otherLevels[gameType].level_1;
		}



		//Is there any dialog in this room, if yes, what are they.
		//Later on check if they've been completed
		function getRoomDialogs(levelKey, roomKey){
			var currentRoomCheck = service[levelKey].rooms[roomKey];
			var dialogs = [];

			angular.forEach(currentRoomCheck.characters, function(characterData,characterName){
				if(characterData.dialogKey){
					dialogs.push(characterData.dialogKey);
				}
				if(characterData.secondConvo && characterData.secondConvo.dialogKey){
					dialogs.push(characterData.secondConvo.dialogKey);
				}
			});
			return dialogs;
		}

		function getSuccessPaths(dialogKey) {
			for (var levelKey in service) {
				if (levelKey.indexOf('level_')===0) {
					var levelInfo = service[levelKey];
					for (var roomKey in levelInfo.rooms) {
						var roomInfo = levelInfo.rooms[roomKey];
						for (var charKey in roomInfo.characters) {
							var charInfo = roomInfo.characters[charKey];

							if (charInfo.dialogKey===dialogKey) {
								return charInfo.successPaths;
							}

							if (charInfo.secondConvo && charInfo.secondConvo.dialogKey===dialogKey) {
								return charInfo.secondConvo.successPaths;
							}

						}
					}
				}
			}

			// not found!
			return [];
		}

		function fixDamnSuccessPaths() {
			for (var i=0;i<7;i++) {
				var levelName = "level_"+(i_1);
				var levelData = service[levelName];

			}
		}

	}//end of controller
})();
/*rooms
lobby:{
	characters:{}
},
conferenceRoom:{
	characters:{}
},
anniesOffice:{
	characters:{}
},
mikesOffice:{
	characters:{}
},
fransOffice:{
	characters:{}
},
breakRoom:{
	characters:{}
}*/
