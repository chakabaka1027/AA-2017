(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.service('gM_RoomData', gM_RoomData);

	/** @ngInject */
	function gM_RoomData(){
		var roomData = {
			anniesOffice: { //Annie's Office
				bg: "assets/images/rooms/Annie-Room-Bkgd.jpg",
				furniture:{ 
					plant_1:{
						posX: 865, posY: 360,
						collider_width: 64, collider_height: 154,
						collider_X_offset: 0, collider_Y_offset: 15
					},
					bookshelf:{
						posX: 618.5, posY: 108.5,
						collider_width: 135, collider_height: 209,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					left_door:{
						posX: 20.5, posY: 289.5,
						collider_width: 31, collider_height: 289,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					top_right_door:{
						posX: 770, posY: 88,
						collider_width: 142, collider_height: 172,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					tall_cabinet:{
						posX: 106.5, posY: 145,
						collider_width: 99, collider_height: 224,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					clock:{
						posX: 876.5, posY: 52,
						collider_width: 67, collider_height: 52,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					annies_whiteBoard:{
						posX: 451, posY: 69,
						collider_width: 148, collider_height: 94,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					anniesRoomDesk:{
						posX: 304.5, posY: 171,
						collider_width: 257, collider_height: 154,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					blueChair_1:{
						posX: 480.5, posY: 191,
						collider_width: 95, collider_height: 140,
						collider_X_offset: 0, collider_Y_offset: 0,
						mirror:"yes"
					},
					blueChair_2:{
						posX: 275.5, posY: 254.5,
						collider_width: 91, collider_height: 141,
						collider_X_offset: 0, collider_Y_offset: 0
					}
				} 
			},
			mikesOffice: {   //mike's office
				bg: "assets/images/rooms/Mike-Room-Bkgd.jpg",
				furniture:{
					small_plant:{
						posX: 87, posY: 160,
						collider_width: 60, collider_height: 120,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					small_cabinet:{
						posX: 303.5, posY: 140,
						collider_width: 100, collider_height: 150,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					whiteBoard:{
						posX: 725, posY: 74,
						collider_width: 148, collider_height: 94,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					lamp:{
						posX: 867, posY: 120.5,
						collider_width: 40, collider_height: 218,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					computerDesk_1:{
						posX: 499.5, posY: 155.5,
						collider_width: 257, collider_height: 180,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					right_door:{
						posX: 927.5, posY: 260,
						collider_width: 31, collider_height: 150,
						collider_X_offset: 0, collider_Y_offset: 50
					},
					blueChair_1:{
						posX: 353.5, posY: 252,
						collider_width: 85, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: -2
					},
					blueChair_2:{
						posX: 461.5, posY: 240.5,
						collider_width: 81, collider_height: 90,
						collider_X_offset: 0, collider_Y_offset: -5
					},
					couch2:{
						posX: 73.5, posY: 360.5,
						collider_width: 123, collider_height: 213,
						collider_X_offset: 0, collider_Y_offset: 0
					}
				}
			},
			fransOffice: {   //fran's Office
				bg: "assets/images/rooms/Fran-Room-Bkgd.jpg",
				furniture:{
					clock:{
						posX: 271.5, posY: 58,
						collider_width: 67, collider_height: 52,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					bookshelf:{
						posX: 830.5, posY: 124.5,
						collider_width: 135, collider_height: 209,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					whiteBoard:{
						posX: 679, posY: 71,
						collider_width: 148, collider_height: 94,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					computerDesk_1:{
						posX: 515.5, posY: 154.5,
						collider_width: 257, collider_height: 127,
						collider_X_offset: 0, collider_Y_offset: 20
					},
					right_door:{
						posX: 927.5, posY: 280,
						collider_width: 31, collider_height: 140,
						collider_X_offset: 0, collider_Y_offset: 40
					},
					blueChair_1:{
						posX: 450.5, posY: 266,
						collider_width: 80, collider_height: 110,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					plant_1:{
						posX: 94, posY: 147,
						collider_width: 30, collider_height: 200,
						collider_X_offset: 0, collider_Y_offset: 5
					},
					small_plant:{
						posX: 87, posY: 396,
						collider_width: 56, collider_height: 110,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					small_cabinet:{
						posX: 320.5, posY: 176.5, 
						collider_width: 99, collider_height: 161,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					small_cabinet2:{
						posX: 215.5, posY: 176.5,
						collider_width: 99, collider_height: 161,
						collider_X_offset: 0, collider_Y_offset: 0
					}
				}
			},
			lobby: { //lobby
				bg: "assets/images/rooms/Lobby-Bkgd.jpg",
				furniture:{
					top_right_door:{
						posX: 810, posY: 86,
						collider_width: 142, collider_height: 172,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					top_left_door:{
						posX: 148, posY: 86,
						collider_width: 142, collider_height: 172,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					computerDesk_1:{
						posX: 303.5, posY: 365.5,
						collider_width: 257, collider_height: 150,
						collider_X_offset: 0, collider_Y_offset: 20
					},
					couch1:{
						posX: 482, posY: 169.5,
						collider_width: 236, collider_height: 117,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					small_plant:{
						posX: 297, posY: 160,
						collider_width: 56, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: 10
					},
					small_plant2:{
						posX: 665, posY: 167,
						collider_width: 56, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: 10
					},
					clock:{
						posX: 485.5, posY: 52,
						collider_width: 67, collider_height: 52,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					blueChair_1:{
						posX: 287.5, posY: 439,
						collider_width: 95, collider_height: 50,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					left_door:{
						posX: 21.5, posY: 293.5,
						collider_width: 31, collider_height: 125,
						collider_X_offset: 0, collider_Y_offset: 40
					},
					right_door:{
						posX: 928.5, posY: 314.5,
						collider_width: 31, collider_height: 125,
						collider_X_offset: 0, collider_Y_offset: 40
					}
				}
			},
			breakRoom: { //breakRoom
				bg: "assets/images/rooms/Break-Room-Bkgd.jpg",
				furniture: {
					breakRoom_Poster1: {
						posX: 600, posY: 55,
						collider_width: 90, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					breakRoom_Poster2: {
						posX: 930, posY: 200,
						collider_width: 40, collider_height: 350,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					foldingChair_1:{ 
						posX: 600, posY: 200,
						collider_width: 70, collider_height: 90,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					foldingChair_3:{ //sideways
						posX: 100, posY: 205,
						collider_width: 100, collider_height: 150,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					foldingChair_2:{ //angle
						posX: 100, posY: 325,
						collider_width: 80, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					breakRoom_Table:{
						posX: 250, posY: 200,
						collider_width: 300, collider_height: 110,
						collider_X_offset: 0, collider_Y_offset: -5
					},
					waterCooler:{
						posX: 520, posY: 150,
						collider_width: 60, collider_height: 180,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					plant_1:{
						posX: 880, posY: 400,
						collider_width: 55, collider_height: 190,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					top_right_door:{
						posX: 800, posY: 95,
						collider_width: 115, collider_height: 165,
						collider_X_offset: 0, collider_Y_offset: 0
					}
				}
			},
			conferenceRoom:{ //conference Room
				bg: "assets/images/rooms/Conference-Room-Bkgd.jpg",
				furniture:{
					small_plant:{
						posX: 652, posY: 162,
						collider_width: 74, collider_height: 120,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					small_plant2:{
						posX: 291, posY: 162,
						collider_width: 74, collider_height: 120,
						collider_X_offset: 0, collider_Y_offset: -5
					},
					beige_chair_sideways:{ //right
						posX: 717.5, posY: 366,
						collider_width: 80, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: -5,
						mirror: "yes"
					},
					beige_chair_sideways2:{ //left
						posX: 251.5, posY: 374,
						collider_width: 80, collider_height: 100,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					beige_chair_angle:{
						posX: 865.5, posY: 212.5,
						collider_width: 90, collider_height: 101,
						collider_X_offset: 0, collider_Y_offset: 0,
						mirror: "yes"
					},
					conferenceRoomTable:{
						posX: 483.5, posY: 379,
						collider_width: 437, collider_height: 136,
						collider_X_offset: 0, collider_Y_offset: -10
					},
					beige_chair_back:{
						posX: 389.5, posY: 444,
						collider_width: 77, collider_height: 108,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					beige_chair_back2:{
						posX: 586.5, posY: 451,
						collider_width: 77, collider_height: 108,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					easel_board:{
						posX: 115.5, posY: 170.5,
						collider_width: 93, collider_height: 143,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					presentation_tv_stand:{
						posX: 475, posY: 136.5,
						collider_width: 236, collider_height: 209,
						collider_X_offset: 0, collider_Y_offset: 0
					},
					left_door:{
						posX: 21.5, posY: 291.5,
						collider_width: 31, collider_height: 169,
						collider_X_offset: 0, collider_Y_offset: 45
					},
					clock:{
						posX: 868.5, posY: 58,
						collider_width: 67, collider_height: 52,
						collider_X_offset: 0, collider_Y_offset: 0
					}
				}
			}
		};
		return roomData;
	}
})();
/*
	Rooms:
		conferenceRoom
		anniesOffice
		mikesOffice
		fransOffice
		lobby
		breakRoom
*/ 