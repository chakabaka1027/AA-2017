(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.service('gM_Char_Position_Data', gM_Char_Position_Data);

	/** @ngInject */
	function gM_Char_Position_Data(){
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
		var gameCharacterData = {
			annie: {
				startingX: 750, startingY: 260,
				colliderXoffset: -2, colliderYoffset: 75,
				colliderWidth: 60, colliderHeight: 35,
				lobby: {
					conferenceRoom: startLocations.lowerL,
					anniesOffice: startLocations.sideL,
					breakRoom: startLocations.upperR,
					fransOffice: startLocations.sideR,
					mikesOffice: startLocations.lowerR
				},
				conferenceRoom: {
					lobby: startLocations.upperR,
					anniesOffice: startLocations.upperR,
					mikesOffice: startLocations.sideR
				},
				anniesOffice: {
					lobby: startLocations.sideR,
					conferenceRoom: startLocations.lowerR
				},
				breakRoom: {
					lobby: startLocations.lowerR
				},
				fransOffice: {
					lobby: startLocations.sideL
				},
				mikesOffice: {
					lobby: startLocations.upperL,
					conferenceRoom:  startLocations.sideL
				}
			},
			mike:{
				conferenceRoom:{
					startLeftX: 430, startLeftY: 180,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60,
					mirror:"yes"
				},
				mikesOffice:{
					startLeftX: 550, startLeftY: 250,
					colliderXoffset: -2, colliderYoffset: 60,
					colliderWidth: 60, colliderHeight: 60
				}
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
					startLeftX: 330, startLeftY: 380,
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
			}
		}
		return gameCharacterData;
	}
})();