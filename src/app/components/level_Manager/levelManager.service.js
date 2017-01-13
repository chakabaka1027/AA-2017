(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.service('levelDataHandler', levelDataHandler);

	/** @ngInject */
	function levelDataHandler($log){
		var allLevelData = {
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
				requiredConversations: ['mike_GR_02', 'fran_GR_01','fran_RQ_01','charlie_01'],
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
							luna:{}
						}
					}
				}
			},
			level_5:{ /*~~~~~~~~~~~~~~~~~~~~~~FIVE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['mike_SmallTk_01', 'mike_RQ_01', 'fran_GR_02', 'luna_01'],
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
							charlie:{},
							luna:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "luna_01" 
							}
						}
					}
				}
			},
			level_6:{ /*~~~~~~~~~~~~~~~~~~~~~~SIX~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['mike_SmallTk_02', 'fran_SmallTk_02', 'charlie_02', 'luna_02'],
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
								dialogKey: "charlie_02"
							},
							luna:{
								successPaths: ["ACC","CAC","CCA","BBC","BCB","CBB","BCC","CBC","CCB","CCC"],
								dialogKey: "luna_02"
							}
						}
					}
				}
			},
			level_7:{ /*~~~~~~~~~~~~~~~~~~~~~~SEVEN~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				requiredConversations: ['mike_RQ_02', 'fran_RQ_02'],
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
							charlie:{},
							luna:{}
						}
					}
				}
			},
			getRoomDialogs: getRoomDialogs
		};
		return allLevelData;

		//Is there any dialog in this room, if yes, what are they. 
		//Later on check if they've been completed
		function getRoomDialogs(levelKey, roomKey){
			var currentRoomCheck = allLevelData[levelKey].rooms[roomKey];
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