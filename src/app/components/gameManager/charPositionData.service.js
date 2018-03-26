(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.service('charPositionData', charPositionData);

	/** @ngInject */
	function charPositionData(){

		var startLocations = {
			upperL:{ //if you make the y too low or too high she'll collide with the door
				x: 115, y: 150, animationState: "standingDown", mirror: null
			},
			upperR:{
				x: 815, y: 125, animationState: "standingDown", mirror: null
			},
			sideL:{
				x: 80, y: 330, animationState: "standingSide", mirror: "yes" //Non-mirrored faces left
			},
			sideR:{
				x: 880, y: 330, animationState: "standingSide", mirror: null
			},
			lowerR:{
				x: 830, y: 410, animationState: "standingUp", mirror: null
			},
			lowerL:{
				x: 175, y: 410, animationState: "standingUp", mirror: null
			}
		};

		//just for testing - defaulr postions
		var costumePosSet = { //to use if they all have the same thing but since postions iwll be diffrent might be better to have hardcoded specfic ones for all ?

			//lobby postions
			lobby:{
				pos1L: {
					startLeftX: 465, startLeftY: 240,
					colliderXoffset: 5, colliderYoffset: 40,
					colliderWidth: 60, colliderHeight: 95,
				},
				pos1R: {
					startLeftX: 465, startLeftY: 240,
					colliderXoffset: 5, colliderYoffset: 40,
					colliderWidth: 60, colliderHeight: 95,
					mirror:"no"	},
				pos2L: {
					startLeftX: 500, startLeftY: 400,
					colliderXoffset: 5, colliderYoffset: 40,
					colliderWidth: 60, colliderHeight: 95,
					mirror:"no"
				},
				pos2R: {
					startLeftX: 500, startLeftY: 400,
					colliderXoffset: 5, colliderYoffset: 40,
					colliderWidth: 60, colliderHeight: 95,
					}
			},
			conferenceRoom:{
				pos1L: {
					startLeftX: 430, startLeftY: 190,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos1R: {
					startLeftX: 465, startLeftY: 240,
					colliderXoffset: 5, colliderYoffset: 40,
					colliderWidth: 60, colliderHeight: 95,
					mirror:"yes"	},
				pos2L: {
					startLeftX: 430, startLeftY: 190,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos2R: {
					startLeftX: 465, startLeftY: 240,
					colliderXoffset: 5, colliderYoffset: 40,
					colliderWidth: 60, colliderHeight: 95,
					mirror:"yes"	}
			},

			anniesOffice1:{
				pos1L: {
					startLeftX: 480, startLeftY: 260, //was 330
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos1R: {
					startLeftX: 480, startLeftY: 260, //was 330
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"no"	},
		},
			anniesOffice2:{
				pos1L: {
					startLeftX: 480, startLeftY: 260, //was 330
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos1R: {
					startLeftX: 480, startLeftY: 260, //was 330
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					},
			},
			fransOffice:{
				pos1L: {
					startLeftX: 570, startLeftY: 190,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos1R: {
					startLeftX: 570, startLeftY: 190,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"no"	},

			},
			breakRoom:{
				pos1L: {
					startLeftX: 570, startLeftY: 190,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos1R: {
					startLeftX: 570, startLeftY: 190,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"no"	},
				pos2L: {
					startLeftX: 330, startLeftY: 380, //was 330
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"no"
				},
				pos2R: {
					startLeftX: 330, startLeftY: 380, //was 330
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
				},
				pos3L: {
					startLeftX: 440, startLeftY: 240,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"no"
				},
				pos3R: {
					startLeftX: 440, startLeftY: 240,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60
					}

			},
			mikesOffice1:{
				pos1L: {
					startLeftX: 550, startLeftY: 250,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60
				},
				pos1R: {
					startLeftX: 550, startLeftY: 250,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"yes"
				}
			},
			mikesOffice2:{
				pos1L: {
					startLeftX: 550, startLeftY: 250,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60
				},
				pos1R: {
					startLeftX: 550, startLeftY: 250,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"yes"	},
					}
		};

		var service = {

			annie: {
				startingX: 750, startingY: 260,
				colliderXoffset: -2, colliderYoffset: 75,
				colliderWidth: 60, colliderHeight: 35,
				lobby: {
					conferenceRoom: startLocations.lowerL,
					anniesOffice1: startLocations.sideL,
					anniesOffice2: startLocations.sideL,
					breakRoom: startLocations.upperR,
					fransOffice: startLocations.sideR,
					mikesOffice1: startLocations.lowerR,
					mikesOffice2: startLocations.lowerR
				},
				conferenceRoom: {
					lobby: startLocations.upperR,
					anniesOffice1: startLocations.upperR,
					anniesOffice2: startLocations.upperR,
					mikesOffice1: startLocations.sideR,
					mikesOffice2: startLocations.sideR
				},
				anniesOffice1: {
					lobby: startLocations.sideR,
					conferenceRoom: startLocations.lowerR
				},
				anniesOffice2: {
					lobby: startLocations.sideR,
					conferenceRoom: startLocations.lowerR
				},
				breakRoom: {
					lobby: startLocations.lowerR
				},
				fransOffice: {
					lobby: startLocations.sideL
				},
				mikesOffice1: {
					lobby: startLocations.upperL,
					conferenceRoom:  startLocations.sideL
				},
				mikesOffice2: {
					lobby: startLocations.upperL,
					conferenceRoom:  startLocations.sideL
				}
			},

			mike:{costumePosSet }
			,

			fran: {
				conferenceRoom:costumePosSet.conferenceRoom,
				anniesOffice1:costumePosSet.anniesOffice1,
				anniesOffice2:costumePosSet.anniesOffice2,
				mikesOffice1:costumePosSet.mikesOffice1,
				mikesOffice2:costumePosSet.mikesOffice2,
				lobby:costumePosSet.lobby,
				breakRoom: costumePosSet.breakRoom,
				fransOffice: costumePosSet.fransOffice
			},
			charlie: {
				conferenceRoom:costumePosSet.conferenceRoom,
				anniesOffice1:costumePosSet.anniesOffice1,
				anniesOffice2:costumePosSet.anniesOffice2,
				mikesOffice1:costumePosSet.mikesOffice1,
				mikesOffice2:costumePosSet.mikesOffice2,
				lobby:costumePosSet.lobby,
				breakRoom: costumePosSet.breakRoom,
				fransOffice: costumePosSet.fransOffice
			},
		luna: {
			conferenceRoom:costumePosSet.conferenceRoom,
			anniesOffice1:costumePosSet.anniesOffice1,
			anniesOffice2:costumePosSet.anniesOffice2,
			mikesOffice1:costumePosSet.mikesOffice1,
			mikesOffice2:costumePosSet.mikesOffice2,
			lobby:costumePosSet.lobby,
			breakRoom: costumePosSet.breakRoom,
			fransOffice: costumePosSet.fransOffice
			},
			stu: {
				conferenceRoom:costumePosSet.conferenceRoom,
				anniesOffice1:costumePosSet.anniesOffice1,
				anniesOffice2:costumePosSet.anniesOffice2,
				mikesOffice1:costumePosSet.mikesOffice1,
				mikesOffice2:costumePosSet.mikesOffice2,
				lobby:costumePosSet.lobby,
				breakRoom: costumePosSet.breakRoom,
				fransOffice: costumePosSet.fransOffice
			},

			getCharLoc: getCharLoc
		};

		return service;

		function getCharLoc(characterName, roomName, position) {
			return service[characterName][roomName][position];


		}
	}
})();
//update this



// service. stu. room . postion
/*
//or room charecter and then postion ? for now using baove because its what was written as code
stu {
			lobby {
				position a {

					}
					position b {
					}
					position c {
					}
}
}

...et

old strucrue
from here untill getcharloc
var service = {
	annie: {
		startingX: 750, startingY: 260,
		colliderXoffset: -2, colliderYoffset: 75,
		colliderWidth: 60, colliderHeight: 35,
		lobby: {
			conferenceRoom: startLocations.lowerL,
			anniesOffice1: startLocations.sideL,
			anniesOffice2: startLocations.sideL,
			breakRoom: startLocations.upperR,
			fransOffice: startLocations.sideR,
			mikesOffice1: startLocations.lowerR,
			mikesOffice2: startLocations.lowerR
		},
		conferenceRoom: {
			lobby: startLocations.upperR,
			anniesOffice1: startLocations.upperR,
			anniesOffice2: startLocations.upperR,
			mikesOffice1: startLocations.sideR,
			mikesOffice2: startLocations.sideR
		},
		anniesOffice1: {
			lobby: startLocations.sideR,
			conferenceRoom: startLocations.lowerR
		},
		anniesOffice2: {
			lobby: startLocations.sideR,
			conferenceRoom: startLocations.lowerR
		},
		breakRoom: {
			lobby: startLocations.lowerR
		},
		fransOffice: {
			lobby: startLocations.sideL
		},
		mikesOffice1: {
			lobby: startLocations.upperL,
			conferenceRoom:  startLocations.sideL
		},
		mikesOffice2: {
			lobby: startLocations.upperL,
			conferenceRoom:  startLocations.sideL
		}
	},
	mike:{
		conferenceRoom:{
			startLeftX: 430, startLeftY: 190,
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
			mirror:"yes"
		},
		mikesOffice1:{
			startLeftX: 550, startLeftY: 250,
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60
		},
		mikesOffice2:{
			startLeftX: 550, startLeftY: 250,
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60
		},
		lobby:{
			startLeftX: 465, startLeftY: 240,
			colliderXoffset: 5, colliderYoffset: 40,
			colliderWidth: 60, colliderHeight: 95
		},
	},
	fran: {
		lobby:{
			startLeftX: 465, startLeftY: 240,
			colliderXoffset: 5, colliderYoffset: 40,
			colliderWidth: 60, colliderHeight: 95,
			mirror: "yes"
		},
		fransOffice:{
			startLeftX: 570, startLeftY: 190,
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
			mirror: "yes"
		},
		breakRoom:{
			startLeftX: 570, startLeftY: 190,
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
			mirror: "yes"
		}
	},
	charlie: {
		breakRoom:{
			startLeftX: 330, startLeftY: 380, //was 330
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
			mirror: "yes"
		}

	},
	luna: {
		breakRoom:{
			startLeftX: 440, startLeftY: 240,
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60
		}
	},
	stu: { //for now only - will change later
		lobby:{
			startLeftX: 465, startLeftY: 240,
			colliderXoffset: 5, colliderYoffset: 40,
			colliderWidth: 60, colliderHeight: 95
		},
		breakRoom:{
			startLeftX: 330, startLeftY: 380, //was 330
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
		},
		anniesOffice1:{
			startLeftX: 480, startLeftY: 260, //was 330
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
		},
		anniesOffice2:{
			startLeftX: 480, startLeftY: 260, //was 330
			colliderXoffset: -2, colliderYoffset: 60,
			colliderWidth: 60, colliderHeight: 60,
		}
	},











	mike:{ //remove this ater and have it via methodjust once
		conferenceRoom:costumePosSet.conferenceRoom,
		anniesOffice1:costumePosSet.anniesOffice1,
		anniesOffice2:costumePosSet.anniesOffice2,
		mikesOffice1:costumePosSet.mikesOffice1,
		mikesOffice2:costumePosSet.mikesOffice2,
		lobby:costumePosSet.lobby,
		breakRoom: costumePosSet.breakRoom,
		fransOffice: costumePosSet.fransOffice
		//or something like this for eahc one  -- alternate thing

		// lobby:{
		// 	pos1L: {
		// 		startLeftX: 465, startLeftY: 240,
		// 		colliderXoffset: 5, colliderYoffset: 40,
		// 		colliderWidth: 60, colliderHeight: 95,
		//
		// 	},
		// 	pos1R: {
		// 		startLeftX: 465, startLeftY: 240,
		// 		colliderXoffset: 5, colliderYoffset: 40,
		// 		colliderWidth: 60, colliderHeight: 95,
		// 		mirror:"no"	},
		// 	pos2L: {
		// 		startLeftX: 500, startLeftY: 400,
		// 		colliderXoffset: 5, colliderYoffset: 40,
		// 		colliderWidth: 60, colliderHeight: 95,
		// 		mirror:"no"
		// 	},
		// 	pos2R: {
		// 		startLeftX: 500, startLeftY: 400,
		// 		colliderXoffset: 5, colliderYoffset: 40,
		// 		colliderWidth: 60, colliderHeight: 95,
		// 		}
		// },
 */



//
