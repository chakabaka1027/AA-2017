(function() {
  'use strict';
  angular
    .module('awkwardAnnie')
    .directive('gameManager', gameManager);

  /** @ngInject */
  function gameManager(charPositionData, animationData, roomData, furnitureData,
    levelDataHandler, mappingService, arrowData, audioService, userDataService, userGameInfo,
    $location, $log) {

    var directive = {
      restrict: 'E',
      // templateUrl: defined in index.route.js file
      // link: link,
      scope: {
        main: "="
      },
      controller: controller, //controller for this directive
      controllerAs: 'vm',
      bindToController: true,
      link: link,
      //template: ['<div class="debugContainer">',
      //				'<input type="checkbox" ng-model="vm.walkingInfo.allowMouseHold">Allow Mouse Click</input>',
      //			'</div>'].join("")
      template: ''
    };
    return directive;

    function link(scope, elm, attrs, ctlr) {

      var mouseAnchorX;
      var mouseAnchorY;

      ctlr.updateWalkDirection = updateWalkDirection;

      elm.on("mousedown", mouseDown);
      $('html').on("mouseup", mouseUp);

      $('html').on('keydown', trackKeys);

      scope.$watch(function() {
        return ctlr.walkingInfo.walking;
      }, function() {
        if (!ctlr.walkingInfo.walking) {
          elm.off("mousemove", mouseMove);
        }
      })

      scope.$on('$destroy', releaseBindings);

      function trackKeys(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        //    up key        down key         right key    left key
        if (code === 38 || code === 40 || code === 39 || code === 37) {
          ctlr.walkingInfo.wasMouseTriggered = false;
          ctlr.annie_Walking = true; //set to true when we press on the key - sets to false if off of key ?
          ctlr.walkingInfo.walking = true;
          switch (code) {
            case 38:
              ctlr.walkingInfo.direction = "up";
              break;
            case 40:
              ctlr.walkingInfo.direction = "down";
              break;
            case 39:
              ctlr.walkingInfo.direction = "right";
              break;
            case 37:
              ctlr.walkingInfo.direction = "left";
              break;
          }

          // showArrows = false; //Uncomment if ETS changes mind
          //annieWalkingCode = code;

        }
      }

      function mouseDown(evt) {

        if (!ctlr.walkingInfo.allowMouseHold) {
          elm.on("mousemove", mouseMove);
        }

        mouseAnchorX = evt.offsetX;
        mouseAnchorY = evt.offsetY;

        ctlr.walkingInfo.walking = true;
        ctlr.walkingInfo.wasMouseTriggered = true;

        updateWalkDirection();

      }

      function mouseUp(evt) {

        elm.off("mousemove", mouseMove);

        if (!ctlr.walkingInfo.allowMouseHold) {
          ctlr.walkingInfo.walking = false;
        }


      }

      function mouseMove(evt) {
        mouseAnchorX = evt.offsetX;
        mouseAnchorY = evt.offsetY;
      }

      function updateWalkDirection() {
        if (ctlr.walkingInfo.walking && ctlr.walkingInfo.wasMouseTriggered) {
          var xa = ctlr.anniePosition.x;
          var ya = ctlr.anniePosition.y;

          var xm = mouseAnchorX;
          var ym = mouseAnchorY;

          var dx = xa - xm;
          var dy = ya - ym;

          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 15) {
            ctlr.walkingInfo.walking = false;
            return;
          }

          var b1 = ya - xa;
          var b2 = ya + xa;

          var isAboveLine1 = (ym < xm + b1);
          var isAboveLine2 = (ym < -xm + b2);


          var udrl;
          if (isAboveLine1 && isAboveLine2) {
            udrl = "up";
          } else if (!isAboveLine1 && isAboveLine2) {
            udrl = "left";
          } else if (isAboveLine1 && !isAboveLine2) {
            udrl = "right";
          } else if (!isAboveLine1 && !isAboveLine2) {
            udrl = "down";
          }

          ctlr.walkingInfo.direction = udrl;


        }
      }

      function releaseBindings() {
        elm.off("mousemove", mouseMove);
        elm.off("mousedown", mouseDown);
        $('html').off("mouseup", mouseUp);
        $('html').off('keydown', trackKeys);
      }
    }

    /** @ngInject */
    function controller($state, $scope, $timeout, $window) { //needs to be inside gameManager and have inject before
      var vm = this;

      var myCanvas;
      var currentRoomKey = vm.main.roomKey;
      var arrowDelay = 1250;
      var annie_Talking = false;
      var annieFaceOtherWay = false;
      var currentRoomData = roomData[currentRoomKey];
      var previousRoom = currentRoomKey;
      var newRoom = "";
      var annieSprite,
        annieStartX,
        annieStartY;
      var showArrows = false;
      var timerPromise;
      var showNPCDialogBubble = false;
      var bubbleHeight = 150;
      var conversationResetBubble;
      var lastCharCollidedInto = null;
      var pointsBubble;
      var showPointsBubble = false;
      var canDraw = false;

      var roomEntryCount = 0;

      // Data
      var levelRequiredConvos,
        convoMean,
        convoCounter;
      // sounds
      var doorTransitionSound,
        successfulConvo,
        unsuccessfulConvo;

      vm.anniePosition = {
        x: 0,
        y: 0
      };

      vm.walkingInfo = {
        walking: false,
        direction: "right",
        wasMouseTriggered: false,
        allowMouseHold: true
      };


      vm.flipDialogs = (userDataService.userID === 'flip');


      $scope.$on('$destroy', function() {
        $('html').off('keydown'); //removes event listeners for key down
        myp5.remove();
        if (timerPromise) { //make sure timer is destroyed with the room
          $timeout.cancel(timerPromise);
        }
      });

      $scope.$watch(function() {
        return vm.main.levelCount;
      }, function(newVal, oldVal) { // need to redraw arrows after each convo
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Game_Setup", vm.main.levelCount, "0/3/5");
        levelRequiredConvos = vm.main.arrayToString(vm.main.levelConvosNeeded);
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Game_State", levelRequiredConvos);

        if (vm.main.levelCount > levelDataHandler.maxLevel) { /* END GAME CHECK*/ //so this still gets empliminted but so does the check below
          userDataService.trackAction("Game end", vm.main.roomKey, "Game_End", vm.main.playerScore, "0");
          userDataService.postData(); //end game post data, after conversation is done
          userGameInfo.playerScore = vm.main.playerScore;
          userGameInfo.totalConvos = vm.main.completedConvos.length;
          $timeout(function() {
            $state.go("endScreen");
            //$location.path("/endScreen");
          }, 1000);
          return;
        }

        if (currentRoom && newVal != oldVal) { //make sure there's a room before you check and draw the appropriate guiding arrows
          currentRoom.getDoorStatus();
        }

      });



      /*===================================================================
      	Controller Functions
      ===================================================================*/

      function resetArrowTimer() {
        if (timerPromise) {
          $timeout.cancel(timerPromise);
        }
        timerPromise = $timeout(function() {
          showArrows = true;
        }, arrowDelay);
      }

      function trackRoomEntry() {
          /*========== Tracking Room Enter ===================================*/
          var talkingNPCs = [], npcNames = [];
          for (var spriteName in vm.main.roomData) {
            if (checkRoomDialogs(spriteName)) {
              talkingNPCs.push(spriteName);
              npcNames.push(spriteName);
            }
          }
          userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Room_Enter", npcNames, talkingNPCs.join(' '));
          userDataService.postData(); //room change, post data
      }

      //scope. wtach (watch what - i this case new val and old val ){}


//good comment
      /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      	P5 SKETCH STARTS HERE:
      	creates a room with the appropriate characters, furniture and npcs
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
      var currentRoom = function(room) { //room is just myp5
        var bg;
        currentRoom.getDoorStatus = getDoorStatus;
        currentRoom.drawPointsBubble = drawPointsBubble;
        var positionData = charPositionData;
        var walking_Speed = 7;
        vm.annie_Walking = false;
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
        var npcSprites = [];

        levelRequiredConvos = "";
        showArrows = false;

        $log.log('ROOM ENTRY (currentRoom constructor)', roomEntryCount);

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        	Preload
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        room.preload = function() {
          $log.log('ROOM ENTRY (room.preload)', roomEntryCount);
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
        room.setup = function() {

          roomEntryCount += 1;
          $log.log('ROOM ENTRY (room.setup)', roomEntryCount);

          // room.noLoop();
          room.frameRate(30);
          myCanvas = room.createCanvas(950, 500);
          // ************* this is where the canvas element gets attached to the DOM
          myCanvas.parent(angular.element.find("game-manager")[0]); // equivalent of $($element)[0]);
          // *************
          setFurniture(currentRoomData); //Set up furniture based on
          resetArrowTimer();
          /*==================================================================================
          	Create characters and add animations
          ==================================================================================*/

          npcSprites = [];
          for (var spriteName in vm.main.roomData) {
            var spriteInfo = positionData[spriteName][currentRoomKey];
            if (angular.isUndefined(vm.main.convoCounter[spriteName])) {
              vm.main.convoCounter[spriteName] = 0;
            }
            var npcSprite = room.createSprite(spriteInfo.startLeftX, spriteInfo.startLeftY);
            npcSprite.name = spriteName;
            npcSprite.setCollider("rectangle", spriteInfo.colliderXoffset, spriteInfo.colliderYoffset, spriteInfo.colliderWidth, spriteInfo.colliderHeight);
            addAnimations(animationData[spriteName], npcSprite);
            if (spriteInfo.mirror) {
              npcSprite.mirrorX(-1);
            }
            npcSprites.push(npcSprite);
            // npcSprite.debug = true; //show collider box
          }

          /*====================
          		Create Annie
          ======================*/
          annieSprite = room.createSprite(annieStartX, annieStartY);
          annieSprite.setCollider("rectangle", positionData.annie.colliderXoffset, positionData.annie.colliderYoffset, positionData.annie.colliderWidth, positionData.annie.colliderHeight);
          // annieSprite.debug = true;
          addAnimations(animationData.annie, annieSprite);
          annieSprite.position.x = positionData.annie.startingX;
          annieSprite.position.y = positionData.annie.startingY;

          //fix annie's position after she goes through a door
          if (newRoom && newRoom != previousRoom) {
            var roomEntrance = charPositionData.annie[previousRoom][newRoom];
            annieSprite.position.x = roomEntrance.x;
            annieSprite.position.y = roomEntrance.y;
            annieSprite.changeAnimation(roomEntrance.animationState);
            if (roomEntrance.mirror === "yes") {
              annieSprite.mirrorX(-1);
            }
          }

          conversationResetBubble = room.createSprite(annieSprite.position.x, annieSprite.position.y);
          conversationResetBubble.addAnimation("reset", "assets/images/ResetBubbleAnimations/ResetAnimation01.png", "assets/images/ResetBubbleAnimations/ResetAnimation12.png");
          conversationResetBubble.visible = false;
          /*does next room have dialog, need this data whenever a door is entered*/

          getDoorStatus();
          //doorTransitionSound.setVolume(0.05);

          doorTransitionSound.play();

        }; //end of setup

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        	Draw
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        room.draw = function() {
          room.background(bg);
          collisionswithFurniture(annieSprite, furniture);
          // Set door collision checks seperately
          for (var i in npcSprites) {
            annieSprite.collide(npcSprites[i], dialogTriggered);
          }

          if (currentRoomKey === "mikesOffice" || currentRoomKey === "conferenceRoom" || currentRoomKey === "lobby") {
            if (annieSprite.position.x >= 700 && annieSprite.position.x <= 840 && annieSprite.position.y > 419) {
              handleDoorCollision("lower_right_door");
            }
          }

          if (currentRoomKey === "conferenceRoom") {
            if (annieSprite.position.x >= 125 && annieSprite.position.x <= 180 && annieSprite.position.y > 419) {
              handleDoorCollision("lower_left_door");
            }
          }
          AnnieController();
          drawFurnitureBehind();
          // drawNPCs();
          drawNPCsBehind();
          /*=================== Draw UI elements ===============================================*/
          //If annie is !walking, !talking, start timer
          if (showArrows) {
            drawDoorArrows();
          }
          /*=================== Draw NPC dialog bubble===============================================*/
          manageBubble();

          room.drawSprite(annieSprite); //Put annie at z-index 100, draw sprites after to make them apear above Annie
          drawNPCsInFront();
          drawFurnitureInFront();
          if (conversationResetBubble.visible) {
            room.drawSprite(conversationResetBubble);
          }
          vm.anniePosition = annieSprite.position;
          vm.updateWalkDirection();
        }; //end of draw function

        /*=================== Check when key is released and stop walking ===============================================*/
        room.keyReleased = function(event) {
          vm.annie_Walking = false;
          vm.walkingInfo.walking = false;
        };

        function AnnieController(){          //rename it - testing
          moveAnnieSetUp(minHeight, maxHeight, minWidth, maxWidth ); //declared it out of scope hence sending them - also no need for set up ? works without it ( left it in incase it breaks anything )
          moveAnnie(walking_Speed);

        }
        function manageBubble(){
          npcSprites.forEach(function(character) {
            if (checkRoomDialogs(character.name)) {
              if (character !== lastCharCollidedInto && !showPointsBubble) { //always draw bubble
                drawBubble(character);
              } else if (character === lastCharCollidedInto && !conversationResetBubble.visible && !showPointsBubble) { //if bubble is already drawn, skip bubble
                drawBubble(character);
              }
            }
          });
          if (showPointsBubble) { // draw bubble
            drawPointsBubble(vm.main.totalConvoPoints, lastCharCollidedInto); //lastCharCollidedInto
          }
        }

        function drawFurnitureInFront() {
          furniture.forEach(function(item) {
            if (item.data.position.y > annieSprite.position.y && item.canDrawOnTop) {
              room.drawSprite(item.data);
            }
          });
        }

        function drawFurnitureBehind() {
          furniture.forEach(function(item) {
            if (item.data.position.y < annieSprite.position.y || !item.canDrawOnTop) {
              room.drawSprite(item.data);
            }
          });
        }

        function drawNPCs() {
          npcSprites.forEach(function(sprite) {
            room.drawSprite(sprite);
          });
        }

        function drawNPCsBehind() {
          npcSprites.forEach(function(sprite) {
            if (sprite.position.y < annieSprite.position.y) {
              room.drawSprite(sprite);
            }
          });
        }

        function drawNPCsInFront() {
          npcSprites.forEach(function(sprite) {
            if (sprite.position.y >= annieSprite.position.y) {
              room.drawSprite(sprite);
            }
          });
        }
        //position and create furniture, need to use room so function has to be in a different scope
        function setFurniture(currentRoom) {
          for (var item in currentRoom.furniture) {
            var currentObj = currentRoom.furniture[item];
            var furnitureSprite = {}; //object to hold name as well as collision info
            furnitureSprite.canDrawOnTop = currentObj.canDrawOnTop;
            furnitureSprite.name = item; //Add a name to the furniture object to make it easier when checking for collisions
            // Add sprite data
            furnitureSprite.data = room.createSprite(currentObj.posX, currentObj.posY);
            furnitureSprite.data.setCollider("rectangle", currentObj.collider_X_offset, currentObj.collider_Y_offset, currentObj.collider_width, currentObj.collider_height);
            furnitureSprite.data.addAnimation(item, furnitureData[item]); //gets image here
            if (currentObj.mirror) {
              furnitureSprite.data.mirrorX(-1);
            }
            // furnitureSprite.data.debug = true;
            furniture.push(furnitureSprite);
          }
        }

        function getDoorStatus() {
          // if(!levelDataHandler.lastLevel) {   //  if(vm.main.levelCount <= levelDataHandler.maxLevel){//temporary
            angular.forEach(mappingService[vm.main.roomKey], function(linkingRoom, doorKey) {//what is a lining toom in this annanomus function - it should be a key ?
            var markDoor = false;
            var roomDialogs = levelDataHandler.getRoomDialogs("level_" + vm.main.levelCount, linkingRoom);
            if (!vm.main.areDialogsCompleted(roomDialogs, vm.main.completedConvos)) {
              markDoor = true;
            }
            doorArrows[doorKey] = markDoor;
          });

        }

        function drawDoorArrows() {
          for (var doorKey in doorArrows) {
            var arrowType;
            if (doorArrows[doorKey] === true) {
              arrowType = arrowData[doorKey].arrowImage.hasDialog;
            } else {
              arrowType = arrowData[doorKey].arrowImage.noDialog;
            }
            room.image(arrowImages[arrowType], arrowData[doorKey].x, arrowData[doorKey].y);
          }
        }

        function drawBubble(characterSprite) { //draw NPC has dialog image bubble
          room.image(npcHasDialogBubble, characterSprite.position.x - 40, characterSprite.position.y - characterSprite.height - bubbleHeight);
        }

        function drawPointsBubble(points, npc) {
          var x = npc.position.x;
          var y = npc.position.y - npc.height - 190;
          room.image(pointsBubble, x, y);
          room.textAlign(room.CENTER, room.CENTER);
          room.textSize(22);
          room.fill(0, 102, 153); //color for text
          room.text(points + " Points", x, y, 95, 90);
        }
      }; //end of current room object

      var lastGoodAnniePos = {x:0,y:0};

      var myp5 = new p5(currentRoom); // Create p5 object
      trackRoomEntry();

      /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      	No room/p5 dependencies but need to happen after the p5 object is defined ^
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
      /*=============== add all animations: Parameters(character definition from the char animation service, global characterSprite) ============== */
      function addAnimations(characterDefinition, characterSprite) {
        for (var animationKey in characterDefinition.animations) {
          var frames = [animationKey];
          frames = frames.concat(characterDefinition.animations[animationKey]);
          characterSprite.addAnimation.apply(characterSprite, frames);
        }
      }
      /*================================== Check for collisions with furniture =========================================*/
      function collisionswithFurniture(sprite, furnitureList) {
        var hasCollidedWithNonDoor = false;
        angular.forEach(furnitureList, function(furnitureItem) {
          sprite.collide(furnitureItem.data, function() {
            vm.walkingInfo.walking = false;
            if (furnitureItem.name.indexOf('_door')>=0) {
              handleDoorCollision(furnitureItem.name);
            } else {
              hasCollidedWithNonDoor = true;
            }
          }); //collide(sprite,function)
        });
        if (!hasCollidedWithNonDoor) {
          lastGoodAnniePos.x = annieSprite.position.x;
          lastGoodAnniePos.y = annieSprite.position.y;
        } else {
          annieSprite.position.x = lastGoodAnniePos.x;
          annieSprite.position.y = lastGoodAnniePos.y;
        }
      }
      /*================================== If collided with a door =========================================*/
      // If collided with a door, then load level and check game stats
      function handleDoorCollision(furnitureItem) {
          // console.log("collided with "+ furnitureItem);
          var getNextRoom = mappingService[currentRoomKey][furnitureItem];
          previousRoom = currentRoomKey;
          createRoom(getNextRoom);
      }
      /*================================== Create Room Function =========================================*/
      function createRoom(roomKey) {
        myp5.remove(); //this is the culprit, moving this into a timer creates more than 1 canvas
        myp5 = null;
        $timeout(function() {
          // currentRoomKey = vm.main.roomKey; //To be set by the level manager
          vm.walkingInfo.walking = false;
          newRoom = roomKey;
          currentRoomKey = vm.main.roomKey = roomKey;
          currentRoomData = roomData[roomKey];
          vm.main.setRoomData(roomKey);
          myp5 = new p5(currentRoom);
          trackRoomEntry();
        }, 500);
        vm.main.beginingOfLevel2 = false;
      }

      // Show dialog
      function dialogTriggered(spriteA, spriteB) {
        vm.walkingInfo.walking = false;
        var characters = vm.main.roomData;
        lastCharCollidedInto = spriteB;
        if (conversationResetBubble.visible) { //&& spriteB === lastCharCollidedInto
          return;
        }
        if (characters && characters[spriteB.name]) { // if character exists
          var character = characters[spriteB.name];
          //flip annie and npc inset position depending on the direction annie talks to npc
          if (annieSprite.position.x > spriteB.position.x) {
            vm.main.flipDialogs = false;

          } else {
            vm.main.flipDialogs = true;
          }
          if (character.dialogKey && !annie_Talking) {
            var numOfNPCConvos = vm.main.convoCounter[spriteB.name] += 1;
            vm.main.convoAttemptsTotal += 1;
            if (vm.main.completedConvos.indexOf(character.dialogKey) >= 0) { //if already completed a convo
              if (character.secondConvo && vm.main.completedConvos.indexOf(character.secondConvo.dialogKey) < 0) { // if there's a second conversation and hasn't been completed
                vm.main.currentConversation = character.secondConvo.dialogKey;
                vm.main.talkingWith = spriteB.name;
                vm.main.hideDialog = false;
                annie_Talking = true;
                //EXAMPLE DATA TRACK
                userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "NPC_State", spriteB.name); //vm.main.convoCounter[spriteB.name]
                userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_start", vm.main.currentConversation);
              }
            } else { //if first convo
              vm.main.setConversation(spriteB.name);
              vm.main.hideDialog = false;
              annie_Talking = true;
              userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "NPC_State", spriteB.name); //vm.main.convoCounter[spriteB.name]
              userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_start", vm.main.currentConversation);
            }
          }
        } else { //if character doesn't exist doesn't don't do anything
          return;
        }
        if (annie_Talking) {
          if (timerPromise) {
            $timeout.cancel(timerPromise);
          }
        }

        vm.main.setRoomData(currentRoomKey);
        $scope.$apply();
      }

      function checkRoomDialogs(character) { //called constantnly - can we reduce # of calls ? - ask about loop - no loop p5
        if(typeof vm.main.roomData != 'undefined'){
        var characterDialog = vm.main.roomData[character]; // at some point - the value is undefiend - this happens untill we move to a new room and send in new "Active"charecters - fixed with flag
                                                          // as far as i can tell - otheer than this a work  around could be  adding a flag after we enter a new room - thoughts?
          if (characterDialog && characterDialog.dialogKey) {
            if (vm.main.completedConvos.indexOf(characterDialog.dialogKey) >= 0) {
              if (characterDialog.secondConvo && vm.main.completedConvos.indexOf(characterDialog.secondConvo.dialogKey) < 0) {
                showNPCDialogBubble = true;
                return true;
              }
            } else { //if first convo
              showNPCDialogBubble = true;
              return true;
            }
          } else {
            return false;
          }
        }
      }

      $log.log('controller adding watches...', roomEntryCount);


      $scope.$watch(function() {
        return showPointsBubble;
      }, function(newVal, oldVal) {
        if (newVal != oldVal) {
          currentRoom.drawPointsBubble(vm.main.totalConvoPoints, lastCharCollidedInto);
        }
      });
      // Want to play correct sounds after the player clicks coninue, so it doesn't play over animation sounds
      // It works for the first conversation, and then gives me an error for the rest
      $scope.$watch(function() {
        return vm.main.hideDialog;
      }, function(newVal, oldVal) { //except for initialization
        if (currentRoom) {
          if (vm.main.hideDialog !== oldVal && newVal) { //don't play when it opens
            vm.main.playerScore += vm.main.totalConvoPoints; //update score

            switch (vm.main.lastConversationSuccessful) {
              case true:
                audioService.playAudio("UIrightanswer.wav");
                break;
              case false:
                audioService.playAudio("UIwronganswer.wav");
                break;

            }
          }
        }
      });//end of watch
      $scope.$watch(function(){ return vm.main.hideDialog;}, function(newVal, oldVal) {
        if (newVal && !oldVal) {
          if (annie_Talking) {
            showArrows = false;
            if (!vm.main.lastConversationSuccessful) { //make reset sprite visible
              $timeout(function() {
                conversationResetBubble.visible = false;
                resetArrowTimer();
              }, 2000);
              resetBubble(lastCharCollidedInto.position.x,lastCharCollidedInto.position.y , true );
            } else {
              showPointsBubble = true;
              $timeout(function() {
                showPointsBubble = false;
                /* ~~~~~~~~~~~~~~~~~~~~~~ LEVEL CHECK ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
                if (vm.main.areDialogsCompleted(vm.main.levelConvosNeeded, vm.main.completedConvos)) { //is player done with all convos in the level
                      vm.main.levelCount += 1;
                  if(  vm.main.levelCount <= levelDataHandler.maxLevel ){ //here
                     //long work around but this was not used before - why is it an issue here? added a temp boolian to methods that accsess undefined data
                     /* if(vm.main.levelCount === 2){ vm.main.beginingOfLevel2  = true; } Uncomment if ets wants transition to conference room*/
                    vm.main.nextLevelData(); //maybe add a level count check 0
                  }
                }
              }, 2000);
              resetArrowTimer();
            }
          }
           annie_Talking = false;
        }
      });
//////*****************************  new functions     *************************************/////////
//////*****************************  &helper functions  ************************************/////////
//////******************************** related to annie only - *****************************************************/////////

      //new helper functions - to declutter
      function moveAnnieSetUp(minHeight, maxHeight, minWidth, maxWidth ){  //commented doesnt look like its being needed - but if it is used and setUpWALLKING BOOLIAN IS NT ON - stops annie from moving

        if (annieSprite.position.y < minHeight) {
            annieSprite.position.y += 3;
            setupAnnieWalkingBoolian();
        } else if (annieSprite.position.y > maxHeight) {
            annieSprite.position.y -= 3;
            setupAnnieWalkingBoolian();
        } else if (annieSprite.position.x < minWidth) {
            annieSprite.position.x += 3;
            setupAnnieWalkingBoolian();
        } else if (annieSprite.position.x > maxWidth) {
            annieSprite.position.x -= 3;
            setupAnnieWalkingBoolian();
        }
        //since this happens in evry statmen why not add them in the end - logical error doesn't work // vm.annie_Walking = false;  // vm.walkingInfo.walking = false;// coppying this here stops annie from moving - is something setting it to true ?
    }//end of move annie

      function setupAnnieWalkingBoolian(){//would refactor this but it would create more conditions to be checked  - not sure if it would benifit us //      function setupAnnieWalkingBoolian(xValue, yValue, isWalking){//would refactor this but it would create more conditions to be checked  - not sure if it would benifit us
        vm.annie_Walking = false;
        vm.walkingInfo.walking = false;
      }

      function moveAnnie(walking_Speed){ //this is still ugly -- check if it is being called anywhere else( maybe where we check left.right/up --- ) -
        if (vm.walkingInfo.walking && !annie_Talking) {
          resetArrowTimer();

          if (vm.walkingInfo.direction === "left") { //walk left //paramaters - animation, mirrot value - x vel and y vel
              moveAnnieManagment( "walkingSide",  1, -walking_Speed, 0 ); //odd sending a -v value like this didnt give me an error ? js...
          } else if (vm.walkingInfo.direction === "right") { //walk right
              moveAnnieManagment( "walkingSide",  -1, walking_Speed, 0 );
          } else if (vm.walkingInfo.direction === "up") { //walk up, away from the player
              moveAnnieManagment( "walkingUp",  0, 0, -walking_Speed );
          } else if (vm.walkingInfo.direction === "down") { //walk down, towards the player
              moveAnnieManagment( "walkingDown",  0, 0, walking_Speed );
          }
        } else if (!vm.walkingInfo.walking) { //if not walking or out of bounds, draw standing image

            if (vm.walkingInfo.direction === "left") {
                moveAnnieManagment( "standingSide",  1, 0, 0 ); //not sure if this is a better way or not - adds more lines but it is written - or add a new funciton that does just this-
            } else if (vm.walkingInfo.direction === "right") {//os this being called anywhere else - ?
                moveAnnieManagment( "standingSide",  -1, 0, 0 );
            } else if (vm.walkingInfo.direction === "up") {
                moveAnnieManagment( "standingUp",  0, 0, 0 );
            } else if (vm.walkingInfo.direction === "down") {
                moveAnnieManagment( "standingDown",  0, 0, 0 );
            } else if (annie_Talking) {
              annieSprite.changeAnimation("talking");
              if (annieFaceOtherWay === true) {
                annieSprite.mirrorX(-1);
              }
            }
        }//end of else if
      }
      function resetBubble(xVal, yVal, boolVal){
        conversationResetBubble.position.x =xVal + 5;
        conversationResetBubble.position.y = yVal - 140;
        conversationResetBubble.visible = boolVal;

      }

      function moveAnnieManagment( animation,  mirrorValue, Xvelocity, yVelocity ){
        if(mirrorValue!=0){
          annieSprite.mirrorX(mirrorValue);
        }
        annieSprite.changeAnimation(animation);
        annieSprite.velocity.x = Xvelocity;
        annieSprite.velocity.y = yVelocity;
      }
    } //end of controller
  } //end of game manager/file
})();
