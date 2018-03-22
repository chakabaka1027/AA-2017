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

		//just for testing
		var costumePosSet = {
			pos1:{
				startLeftX: 430, startLeftY: 190,
				colliderXoffset: -2, colliderYoffset: 60,
				colliderWidth: 60, colliderHeight: 60,
				mirror:"yes"
			},
			pos2:{
				startLeftX: 400, startLeftY: 160,
				colliderXoffset: -2, colliderYoffset: 60,
				colliderWidth: 60, colliderHeight: 60,
				mirror:"no"
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

			getCharLoc: getCharLoc
		};

		return service;

		function getCharLoc(characterName, roomName, position) {
			return service[characterName][roomName];
		}
	}
})();
