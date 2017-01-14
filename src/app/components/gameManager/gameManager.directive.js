(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('gameManager', gameManager);

	/** @ngInject */
	function gameManager(gM_Char_Position_Data, gM_Animation_Data, gM_RoomData, gM_FurnitureData, levelDataHandler, mappingService, arrowData, audioService, userDataService, globalGameInfo, $location, $log){
		var directive = {
			restrict:'E',
			// templateUrl: defined in index.route.js file 
			// link: link,
			scope: {
				main: "="
			},
			controller: controller, //controller for this directive
			controllerAs:'vm',
			bindToController: true
		};
		return directive;

		/** @ngInject */
		function controller($scope,$timeout,$window){ //needs to be inside gameManager and have inject before
			var vm = this;

			var myCanvas;
			var currentRoomKey = vm.main.roomKey;
			var arrowDelay = 1250;
			var annie_Walking = false;
			var annie_Talking = false;
			var annieFaceOtherWay = false;
			var currentRoomData = gM_RoomData[currentRoomKey];
			var code;
			var previousRoom = currentRoomKey;
			var newRoom = "";
			var annieWalkingCode;
			var annieSprite,
					annieStartX,
					annieStartY;
			var showArrows = false;
			var timerPromise;
			var showNPCDialogBubble = false;
			var bubbleHeight = 75;
			var resetDisplay;
			var lastCharCollidedInto = null;
			var pointsBubble;
			var showPointsBubble = false;
			// Data
			var talkingNPCs,
					currentNPCs,
					levelRequiredConvos,
					convoMean,
					convoCounter;
			// sounds
			var doorTransitionSound,
					successfulConvo,
					unsuccessfulConvo;
			// vm.main.beginingOfLevel2 = false; //used for ets's level transition comment

			//window.keyUp 
			$('html').on('keydown', function(e) {
				code = e.keyCode ? e.keyCode : e.which;
				//    up key        down key         right key    left key
				if (code === 38 || code === 40 || code === 39 || code === 37){
					annie_Walking = true;
					// showArrows = false; //Uncomment if ETS changes mind
					annieWalkingCode = code;
					if(!annie_Talking){
						resetArrowTimer();
					}
				}
			});

			$scope.$on('$destroy', function(){
				$('html').off('keydown'); //removes event listeners for key down
				myp5.remove();
				if(timerPromise){ //make sure timer is destroyed with the room
					$timeout.cancel(timerPromise);
				}
			});

			$scope.$watch(function(){return vm.main.levelCount;}, function(newVal, oldVal){ // need to redraw arrows after each convo
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"Game_Setup",vm.main.levelCount,"0/3/5");
				levelRequiredConvos = vm.main.arrayToString(vm.main.levelConvosNeeded);
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"Game_State",levelRequiredConvos);

				if(vm.main.levelCount === 8){ /* END GAME CHECK*/
					userDataService.trackAction("Game end",vm.main.roomKey,"Game_End",vm.main.playerScore,"0");
					userDataService.postData(); //end game post data, after conversation is done
					globalGameInfo.playerScore = vm.main.playerScore;
					globalGameInfo.totalConvos = vm.main.completedConvos.length;
					$timeout(function() {
						$location.path("/endScreen");
					}, 1000);
				}
				if(currentRoom && newVal != oldVal){ //make sure there's a room before you check and draw the appropriate guiding arrows
						currentRoom.getDoorStatus();
				}
			});
			
			/*===================================================================
				Controller Functions
			===================================================================*/
			function resetArrowTimer(){
				if(timerPromise){
					$timeout.cancel(timerPromise);
				}
				timerPromise = $timeout(function(){showArrows = true;},arrowDelay);
			}

			/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				P5 SKETCH STARTS HERE:
				creates a room with the appropriate characters, furniture and npcs
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			var currentRoom = function(room){ //room is just myp5
				var bg;
				currentRoom.getDoorStatus = getDoorStatus;
				currentRoom.drawPointsBubble = drawPointsBubble;
				var positionData = gM_Char_Position_Data;
				var walking_Speed = 7;
				annie_Walking = false;
				var furniture = [];
				// For wall collision, should be smaller than screen dimensions
				var minWidth = 70,
						maxWidth = 905,
						minHeight = 100,
						maxHeight = 420;
				//UI
				var dialogUpArrow, dialogDownArrow, dialogLeftArrow, dialogRightArrow;
				var upArrow, downArrow, leftArrow, rightArrow;
				var npcHasDialogBubble;
				var emptyBubble;
				var arrowImages;
				var thoughtBubbleImages;
				var doorArrows = {};
				var currentNPCsprites = [];
				currentNPCs = [];
				talkingNPCs = [];
				levelRequiredConvos = "";
				showArrows = false;
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					Preload
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				room.preload = function(){
					bg = room.loadImage(currentRoomData.bg); //Background changes based on room
					// Sounds
					doorTransitionSound = room.loadSound("assets/sounds/SceneTransition.wav");
					// ui images
					arrowImages = {
						dialogUpArrow: room.loadImage("assets/images/UI/arrow-up-conv.png"),
						dialogDownArrow: room.loadImage("assets/images/UI/arrow-dn-conv.png"),
						dialogLeftArrow: room.loadImage("assets/images/UI/arrow-left-conv.png"),
						dialogRightArrow: room.loadImage("assets/images/UI/arrow-right-conv.png"),
						upArrow: room.loadImage("assets/images/UI/arrow-up.png"),
						downArrow: room.loadImage("assets/images/UI/arrow-dn.png"),
						leftArrow: room.loadImage("assets/images/UI/arrow-left.png"),
						rightArrow: room.loadImage("assets/images/UI/arrow-right.png")
					};
					npcHasDialogBubble = room.loadImage("assets/images/UI/speechIcon.png");
					pointsBubble = room.loadImage("assets/images/UI/PointsBubble.png");
				};

				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					Setup
						creates canvas
						sets up all appropriate chracters in the room for the current level
						adds animations after creating a character sprite
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				room.setup = function(){
					room.frameRate(30);
					myCanvas = room.createCanvas(950,500);
					myCanvas.parent(angular.element.find("game-manager")[0]); // equivalent of $($element)[0]);
					setFurniture(currentRoomData); //Set up furniture based on 
					resetArrowTimer();

				/*==================================================================================
					Create characters and add animations
				==================================================================================*/
					for(var char in vm.main.roomData.characters){
						currentNPCsprites.push(char); // + "_Sprite"
					}

					for(var i in currentNPCsprites){
						var spriteName = currentNPCsprites[i];
						if(angular.isUndefined(vm.main.convoCounter[spriteName])){
							vm.main.convoCounter[spriteName] = 0;
						}
						currentNPCsprites[i] = room.createSprite(positionData[spriteName][currentRoomKey].startLeftX,positionData[spriteName][currentRoomKey].startLeftY);
						currentNPCsprites[i].name = spriteName;
						currentNPCsprites[i].setCollider("rectangle",positionData[spriteName][currentRoomKey].colliderXoffset,positionData[spriteName][currentRoomKey].colliderYoffset,positionData[spriteName][currentRoomKey].colliderWidth,positionData[spriteName][currentRoomKey].colliderHeight);
						addAnimations(gM_Animation_Data[spriteName],currentNPCsprites[i]);
						if(positionData[spriteName][currentRoomKey].mirror){
							currentNPCsprites[i].mirrorX(-1);
						}
						currentNPCs.push(currentNPCsprites[i].name);
						// currentNPCsprites[i].debug = true; //show collider box
					}
					/*====================
							Create Annie
					======================*/
					annieSprite = room.createSprite(annieStartX,annieStartY);
					annieSprite.setCollider("rectangle",positionData.annie.colliderXoffset,positionData.annie.colliderYoffset,positionData.annie.colliderWidth,positionData.annie.colliderHeight);
					// annieSprite.debug = true;
					addAnimations(gM_Animation_Data.annie, annieSprite);  
					annieSprite.position.x = positionData.annie.startingX;
					annieSprite.position.y = positionData.annie.startingY;

					//fix annie's position after she goes through a door
					if(newRoom != previousRoom && newRoom){
						var roomEntrance = gM_Char_Position_Data.annie[previousRoom][newRoom];
						annieSprite.position.x = roomEntrance.x;
						annieSprite.position.y = roomEntrance.y;
						annieSprite.changeAnimation(roomEntrance.animationState);
						if(roomEntrance.mirror === "yes"){
							annieSprite.mirrorX(-1);
						}
					}
					resetDisplay = room.createSprite(annieSprite.position.x,annieSprite.position.y);
					resetDisplay.addAnimation("reset","assets/images/ResetBubbleAnimations/ResetAnimation01.png","assets/images/ResetBubbleAnimations/ResetAnimation12.png");
					resetDisplay.visible = false;
					/*does next room have dialogue, need this data whenever a door is entered*/ 
					getDoorStatus();

					doorTransitionSound.setVolume(0.1);
					doorTransitionSound.play();
					/*========== Track Data ===================================*/ 
					currentNPCsprites.forEach(function(character){ //get talking characters
						if(checkRoomDialogs(character.name)){
							talkingNPCs.push(character.name);
						}
					});
					talkingNPCs = vm.main.arrayToString(talkingNPCs);
					userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"Room_Enter",currentNPCs,talkingNPCs);
					userDataService.postData(); //room change, post data
				}; //end of setup

				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					Draw
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				room.draw = function(){
					room.background(bg);
					collisionswithFurniture(annieSprite,furniture);
					// Set door collision checks seperately
					for(var i in currentNPCsprites){
						annieSprite.collide(currentNPCsprites[i],dialogTriggered);
					}
					// Big step
					if(vm.main.hideDialogue){ //annie not talking
						if(annie_Talking){
							showArrows = false;
							if(!vm.main.lastConversationSuccessful){ //make reset sprite visible
								$timeout(function(){
									resetDisplay.visible = false;
									resetArrowTimer();
								},2000);
								resetDisplay.position.x = lastCharCollidedInto.position.x+5;
								resetDisplay.position.y = lastCharCollidedInto.position.y-140;
								resetDisplay.visible = true;
							}else{ //if convo was successful
									showPointsBubble = true;
									$timeout(function(){
										showPointsBubble = false;
										/* ~~~~~~~~~~~~~~~~~~~~~~ LEVEL CHECK ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
										if(vm.main.areDialogsCompleted(vm.main.levelConvosNeeded,vm.main.completedConvos)){ //is player done with all convos in the level
											vm.main.levelCount += 1; /* if(vm.main.levelCount === 2){ vm.main.beginingOfLevel2  = true; } Uncomment if ets wants transition to conference room*/ 
											vm.main.nextLevelData();
										}
									},2000);
									resetArrowTimer();
							}
						}
						annie_Talking = false;
					}

					// if there's a room on the lower right
					if(currentRoomKey === "mikesOffice" || currentRoomKey === "conferenceRoom" || currentRoomKey === "lobby"){
						if(annieSprite.position.x >= 720 && annieSprite.position.x <= 790 && annieSprite.position.y > 419){
							specialCollision("lower_right_door");
						}
					}

					if(currentRoomKey === "conferenceRoom"){
						if(annieSprite.position.x >= 125 && annieSprite.position.x <= 160 && annieSprite.position.y > 419){
							specialCollision("lower_left_door");
						}
					}

					//ETS wanted this transition, ignoring it for now
					// if(vm.main.levelCount === 2 && vm.main.beginingOfLevel2){
					// 	previousRoom = "lobby";
					// 	createRoom("conferenceRoom");
					// }
					// Keep annie from wallking off the walls
					if(annieSprite.position.y < minHeight){
						annieSprite.position.y += 3;
						annie_Walking = false;
					}else if(annieSprite.position.y > maxHeight){
						annieSprite.position.y -= 3;
						annie_Walking = false;
					}else if(annieSprite.position.x < minWidth){
						annieSprite.position.x += 3;
						annie_Walking = false;
					}else if(annieSprite.position.x > maxWidth){
						annieSprite.position.x -= 3;
						annie_Walking = false;
					}
					// Make annie walk
					if(annie_Walking && !annie_Talking){
						if(annieWalkingCode === room.LEFT_ARROW){ //walk left
							annieSprite.changeAnimation("walkingSide");
							annieSprite.mirrorX(1);
							annieSprite.velocity.x = -walking_Speed;
							annieSprite.velocity.y = 0;
						} else if (annieWalkingCode === room.RIGHT_ARROW) { //walk right
							annieSprite.changeAnimation("walkingSide");
							annieSprite.mirrorX(-1);
							annieSprite.velocity.x = walking_Speed;
							annieSprite.velocity.y = 0;
						}else if (annieWalkingCode === room.UP_ARROW){ //walk up, away from the player
							annieSprite.changeAnimation("walkingUp");
							annieSprite.velocity.y = -walking_Speed;
							annieSprite.velocity.x = 0;
						}else if (annieWalkingCode === room.DOWN_ARROW){ //walk down, towards the player
							annieSprite.changeAnimation("walkingDown");
							annieSprite.velocity.y = walking_Speed;
							annieSprite.velocity.x = 0;
						}
					}	else if(!annie_Walking){ //if not walking or out of bounds, draw standing image
							annieSprite.velocity.x = 0; //Stop annie from walking
							annieSprite.velocity.y = 0;
						if(annieWalkingCode == room.LEFT_ARROW){
							annieSprite.changeAnimation("standingSide");
							annieSprite.mirrorX(1);
						}else if(annieWalkingCode == room.RIGHT_ARROW){
							annieSprite.changeAnimation("standingSide");
							annieSprite.mirrorX(-1);
						}else if(annieWalkingCode == room.UP_ARROW){
							annieSprite.changeAnimation("standingUp");
						}else if(annieWalkingCode == room.DOWN_ARROW){
							annieSprite.changeAnimation("standingDown");
						}else if(annie_Talking){
							annieSprite.changeAnimation("talking");
							if(annieFaceOtherWay === true){
								annieSprite.mirrorX(-1);
							}
						}
					}
					room.drawSprites();
					/*=================== Draw UI elements ===============================================*/
					//If annie is !walking, !talking, start timer
					if(showArrows){
						drawDoorArrows();
					}
					/*=================== Draw NPC dialog bubble===============================================*/
					currentNPCsprites.forEach(function(character){
						if(checkRoomDialogs(character.name)){
							if(character !== lastCharCollidedInto && !showPointsBubble){ //always draw bubble
								drawBubble(character);
							}else if(character === lastCharCollidedInto && !resetDisplay.visible && !showPointsBubble){ //if bubble is already drawn, skip bubble
								drawBubble(character);
							}
						}
					});
					if(showPointsBubble){ // draw bubble
						drawPointsBubble(vm.main.totalConvoPoints,lastCharCollidedInto); //lastCharCollidedInto
					}
					
					room.drawSprite(annieSprite); //Put annie at z-index 100, draw sprites after to make them apear above Annie
				}; //end of draw

				/*=================== Check when key is released and stop walking ===============================================*/
				room.keyReleased = function(event){
					annie_Walking = false;
				};

				//position and create furniture, need to use room so function has to be in a different scope
				function setFurniture(currentRoom) {
					for(var item in currentRoom.furniture){
						var currentObj = currentRoom.furniture[item];
						var furnitureSprite = {}; //object to hold name as well as collision info
						furnitureSprite.name = item; //Add a name to the furniture object to make it easier when checking for collisions
						// Add sprite data
						furnitureSprite.data = room.createSprite(currentObj.posX, currentObj.posY); 
						furnitureSprite.data.setCollider("rectangle",currentObj.collider_X_offset,currentObj.collider_Y_offset,currentObj.collider_width,currentObj.collider_height);
						furnitureSprite.data.addAnimation(item, gM_FurnitureData[item]); //gets image here
						if(currentObj.mirror){
							furnitureSprite.data.mirrorX(-1);
						}
						// furnitureSprite.data.debug = true;
						furniture.push(furnitureSprite);
					}
				}

				function getDoorStatus(){
					angular.forEach(mappingService[vm.main.roomKey], function(linkingRoom, doorKey){
						var markDoor = false;
						var roomDialogs = levelDataHandler.getRoomDialogs("level_"+vm.main.levelCount,linkingRoom);
						if(!vm.main.areDialogsCompleted(roomDialogs,vm.main.completedConvos)){
							markDoor = true;
						}
						doorArrows[doorKey] = markDoor;
					});
				}

				function drawDoorArrows(){
					for(var doorKey in doorArrows){
						var arrowType;
						if(doorArrows[doorKey] === true){
							arrowType = arrowData[doorKey].arrowImage.hasDialog;
						}else{
							arrowType = arrowData[doorKey].arrowImage.noDialog;
						}
						room.image(arrowImages[arrowType],arrowData[doorKey].x,arrowData[doorKey].y);
					}
				}

				function drawBubble(characterSprite){ //draw NPC has dialog image bubble
					room.image(npcHasDialogBubble,characterSprite.position.x-40,characterSprite.position.y-characterSprite.height-bubbleHeight);
				}
				function drawPointsBubble(points,npc){
					var x = npc.position.x+10;
					var y = npc.position.y - npc.height - 90;
					room.image(pointsBubble, x, y);
					room.textAlign(room.CENTER, room.CENTER);
					room.textSize(22);
					room.fill(0, 102, 153); //color for text 
					room.text(points+" Points",x,y,95,90);
				}
			}; //end of current room object
			
			var myp5 = new p5(currentRoom); // Create p5 object

			/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				No room/p5 dependencies but need to happen after the p5 object is defined ^
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			/*=============== add all animations: Parameters(character definition from the char animation service, global characterSprite) ============== */
			function addAnimations(characterDefinition, characterSprite) {
				for(var animationKey in characterDefinition.animations){
					var frames = [animationKey];
					frames = frames.concat(characterDefinition.animations[animationKey]);
					characterSprite.addAnimation.apply(characterSprite, frames);
				}
			}
			/*================================== Check for collisions with furniture =========================================*/
			function collisionswithFurniture(sprite,furnitureList){
				for(var furnitureItem in furnitureList){
					sprite.collide(furnitureList[furnitureItem].data, function(spriteA, spriteB){
						specialCollision(furnitureList[furnitureItem].name);
					}); //collide(sprite,function)
				}
			}
			/*================================== If collided with a door =========================================*/
			// If collided with a door, then load level and check game stats
			function specialCollision(furnitureItem){
				if(furnitureItem === "top_right_door" || furnitureItem === "top_left_door" || furnitureItem === "left_door" || furnitureItem === "right_door" || furnitureItem === "lower_left_door" || furnitureItem === "lower_right_door"){
					var getNextRoom = mappingService[currentRoomKey][furnitureItem];
					previousRoom = currentRoomKey;
					createRoom(getNextRoom);
				}
			}
			/*================================== Create Room Function =========================================*/
			function createRoom(roomKey){
				myp5.remove(); //this is the culprit, moving this into a timer creates more than 1 canvas
				$timeout(function() {
					// currentRoomKey = vm.main.roomKey; //To be set by the level manager
					newRoom = roomKey;
					currentRoomKey =  vm.main.roomKey = roomKey;
					currentRoomData = gM_RoomData[roomKey];
					vm.main.setRoomData(roomKey);
					myp5 = new p5(currentRoom);
				}, 500);
				vm.main.beginingOfLevel2 = false;
			}

			// Show Dialogue
			function dialogTriggered(spriteA,spriteB){
				var characters = vm.main.roomData.characters;
				lastCharCollidedInto = spriteB;
				if(resetDisplay.visible){ //&& spriteB === lastCharCollidedInto
					return;
				}
				if(characters && characters[spriteB.name]){ // if character exists
					var character = characters[spriteB.name];
					if(character.dialogKey && !annie_Talking){
						var numOfNPCConvos = vm.main.convoCounter[spriteB.name] += 1;
						vm.main.convoAttemptsTotal += 1;
						if(vm.main.completedConvos.indexOf(character.dialogKey) >= 0){ //if already completed a convo
							if(character.secondConvo && vm.main.completedConvos.indexOf(character.secondConvo.dialogKey) < 0){ // if there's a second conversation and hasn't been completed
								vm.main.currentConversation = character.secondConvo.dialogKey; 
								vm.main.talkingWith = spriteB.name;
								vm.main.hideDialogue = false;
								annie_Talking = true;
								//EXAMPLE DATA TRACK
								userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"NPC_State",spriteB.name); //vm.main.convoCounter[spriteB.name]
								userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_start",vm.main.currentConversation);
							}
						}else{ //if first convo
							vm.main.setConversation(spriteB.name);
							vm.main.hideDialogue = false;
							annie_Talking = true;
							userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"NPC_State",spriteB.name); //vm.main.convoCounter[spriteB.name]
							userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_start",vm.main.currentConversation);
						}
					}
				}else{ //if character doesn't exist doesn't don't do anything
					return;
				}
				if(annie_Talking){
					if(timerPromise){
						$timeout.cancel(timerPromise);
					}
				}

				vm.main.setRoomData(currentRoomKey);
				$scope.$apply();  //In case html isn't updating and variable is
			}

			function checkRoomDialogs(character){
				var characterDialog = vm.main.roomData.characters[character];
				if(characterDialog && characterDialog.dialogKey ){
					if(vm.main.completedConvos.indexOf(characterDialog.dialogKey) >= 0){
						if(characterDialog.secondConvo && vm.main.completedConvos.indexOf(characterDialog.secondConvo.dialogKey) < 0){
							showNPCDialogBubble = true;
							return true;
						}
					}else{ //if first convo
						showNPCDialogBubble = true;
						return true;
					}
				}else{
					return false;
				}
			}

			$scope.$watch(function(){return showPointsBubble;},function(newVal,oldVal){
				if(newVal != oldVal){
					currentRoom.drawPointsBubble(vm.main.totalConvoPoints,lastCharCollidedInto);
				}
			});
			// Want to play correct sounds after the player clicks coninue, so it doesn't play over animation sounds
			// It works for the first conversation, and then gives me an error for the rest
			$scope.$watch(function(){return vm.main.hideDialogue}, function(newVal,oldVal){ //except for initialization
				if(currentRoom){
					if(vm.main.hideDialogue !== oldVal && newVal){ //don't play when it opens
						vm.main.playerScore += vm.main.totalConvoPoints; //update score
						// Check for end of level
						// if(vm.main.areDialogsCompleted(vm.main.levelConvosNeeded,vm.main.completedConvos)){ //is player done with all convos in the level
						// 	vm.main.levelCount += 1;  if(vm.main.levelCount === 2){ vm.main.beginingOfLevel2  = true; } Uncomment if ets wants transition to conference room 
						// 	vm.main.nextLevelData();
						// }
						switch(vm.main.lastConversationSuccessful){
							case true:
								audioService.playAudio("UIrightanswer.wav"); 
								break;
							case false:
								audioService.playAudio("UIwronganswer.wav");
								break;

						}
					}
				}
			});
		} //end of controller
	} //end of game manager/file
})();