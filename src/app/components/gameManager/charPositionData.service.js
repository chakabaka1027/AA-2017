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

		var costumePosSet = {

			///~~~~~~~~~~~~~~~~~~~~~~~~~~~~first set of postions def~~~~~~~~~~~~~~~~~~~~~~///

			positionsSet1 :{
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
				},
				///~~~~~~~~~~~~~~~~~~~~~~~~~~~~annie postion def~~~~~~~~~~~~~~~~~~~~~~///
				postionSetAnnie:{
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

				}
		};

		var service = {

			annie:costumePosSet.postionSetAnnie,
			mike: costumePosSet.positionsSet1 ,
			fran: costumePosSet.positionsSet1,
			charlie: costumePosSet.positionsSet1,
			luna: costumePosSet.positionsSet1,
			stu: costumePosSet.positionsSet1,

			getCharLoc: getCharLoc
		};

		return service;

		function getCharLoc(characterName, roomName, position) {
			return service[characterName][roomName][position];


		}
	}
	})();
