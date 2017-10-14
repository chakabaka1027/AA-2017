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
      scope: {
        main: "="
      },
      controller: controller,
      controllerAs: 'vm',
      bindToController: true,
      link: link,
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

      scope.$watch(function() {return ctlr.walkingInfo.walking;  }, function() {
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
          ctlr.annie_Walking = true;
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

      function mouseUp() {
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
    }//end of link

    /** @ngInject */
    function controller($state, $scope, $timeout) {
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
      var bubbleHeight = 150;
      var conversationResetBubble;
      var lastCharCollidedInto = null;
      var pointsBubble;
      var showPointsBubble = false;
      var roomEntryCount = 0;
      var levelRequiredConvos;
      var doorTransitionSound;
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
        $('html').off('keydown');
        myp5.remove();
        if (timerPromise) {
          $timeout.cancel(timerPromise);
        }
      });

      function resetArrowTimer() {
        if (timerPromise) {
          $timeout.cancel(timerPromise);
        }
        timerPromise = $timeout(function() {
          showArrows = true;
        }, arrowDelay);
      }

      function trackRoomEntry() {
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
        var npcHasDialogBubble;
        var arrowImages;
        var doorArrows = {};
        var npcSprites = [];
        levelRequiredConvos = "";
        showArrows = false;

        $log.log('ROOM ENTRY (currentRoom constructor)', roomEntryCount);

        room.preload = function() {
          $log.log('ROOM ENTRY (room.preload)', roomEntryCount);
          bg = room.loadImage(currentRoomData.bg);
          doorTransitionSound = room.loadSound("assets/sounds/SceneTransition.wav");
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
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             Setup - creates canvas - sets up all appropriate chracters in the room for the current level
                        - adds animations after creating a character sprite
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        room.setup = function() {
          roomEntryCount += 1;
          $log.log('ROOM ENTRY (room.setup)', roomEntryCount);
          room.frameRate(30);
          myCanvas = room.createCanvas(950, 500);
          myCanvas.parent(angular.element.find("game-manager")[0]);
          setFurniture(currentRoomData);
          resetArrowTimer();
          //Create characters and add animations
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
          }
          //Create Annie
          annieSprite = room.createSprite(annieStartX, annieStartY);
          annieSprite.setCollider("rectangle", positionData.annie.colliderXoffset, positionData.annie.colliderYoffset, positionData.annie.colliderWidth, positionData.annie.colliderHeight);
          addAnimations(animationData.annie, annieSprite);
          annieSprite.position.x = positionData.annie.startingX;
          annieSprite.position.y = positionData.annie.startingY;
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
          getDoorStatus();
          doorTransitionSound.play();
        }; //end of setup
            /*~~~~~~~~~~~~~~~~~~~~~~~~ main draw loop ~~~~~~~~~~~~~~~~~~~~~~*/
        room.draw = function() {
          room.background(bg);
          collisionswithFurniture(annieSprite, furniture);
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
          drawNPCsBehind();
          if (showArrows) {
            drawDoorArrows();
          }
          manageBubble();
          room.drawSprite(annieSprite);
          drawNPCsInFront();
          drawFurnitureInFront();
          if (conversationResetBubble.visible) {
            room.drawSprite(conversationResetBubble);
          }
          vm.anniePosition = annieSprite.position;
          vm.updateWalkDirection();
        }; //end of main draw loop


        room.keyReleased = function() {
          vm.annie_Walking = false;
          vm.walkingInfo.walking = false;
        };

      /*==================================  bubble functions    =========================================*/
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
            /*  ~~~~~~~~~~~~~~ set up ~~~~~~~~~~~~~~~~*/
        function setFurniture(currentRoom) {
          for (var item in currentRoom.furniture) {
            var currentObj = currentRoom.furniture[item];
            var furnitureSprite = {};
            furnitureSprite.canDrawOnTop = currentObj.canDrawOnTop;
            furnitureSprite.name = item;
            furnitureSprite.data = room.createSprite(currentObj.posX, currentObj.posY);
            furnitureSprite.data.setCollider("rectangle", currentObj.collider_X_offset, currentObj.collider_Y_offset, currentObj.collider_width, currentObj.collider_height);
            furnitureSprite.data.addAnimation(item, furnitureData[item]);
            if (currentObj.mirror) {
              furnitureSprite.data.mirrorX(-1);
            }
            furniture.push(furnitureSprite);
          }
        }
        /*  ~~~~~~~~~~~~~~ get status  ~~~~~~~~~~~~~~~~*/

        function getDoorStatus() {
            angular.forEach(mappingService[vm.main.roomKey], function(linkingRoom, doorKey) {
            var markDoor = false;
            var roomDialogs = levelDataHandler.getRoomDialogs("level_" + vm.main.levelCount, linkingRoom);
            if (!vm.main.areDialogsCompleted(roomDialogs, vm.main.completedConvos)) {
              markDoor = true;
            }
            doorArrows[doorKey] = markDoor;
          });

        }
  /*==================================  bubble functions    =========================================*/

        function drawBubble(characterSprite) {
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

        function manageBubble(){
          npcSprites.forEach(function(character) {
            if (checkRoomDialogs(character.name)) {
              if (character !== lastCharCollidedInto && !showPointsBubble) {
                drawBubble(character);
              } else if (character === lastCharCollidedInto && !conversationResetBubble.visible && !showPointsBubble) {
                drawBubble(character);
              }
            }
          });
          if (showPointsBubble) {
            drawPointsBubble(vm.main.totalConvoPoints, lastCharCollidedInto);
          }
        }

        function AnnieController(){
          moveAnnieSetUp(minHeight, maxHeight, minWidth, maxWidth );
          moveAnnie(walking_Speed);
        }

      }; //end of current room object

      var lastGoodAnniePos = {x:0,y:0};

      var myp5 = new p5(currentRoom);
      trackRoomEntry();


        /*================================== Annie helper functions   =========================================*/

      function moveAnnieSetUp(minHeight, maxHeight, minWidth, maxWidth ){

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
    }
      function setupAnnieWalkingBoolian(){
        vm.annie_Walking = false;
        vm.walkingInfo.walking = false;
      }

      function moveAnnie(walking_Speed){
        if (vm.walkingInfo.walking && !annie_Talking) {
          resetArrowTimer();
          if (vm.walkingInfo.direction === "left") { //walk left
              moveAnnieManagment( "walkingSide",  1, -walking_Speed, 0 );
          } else if (vm.walkingInfo.direction === "right") { //walk right
              moveAnnieManagment( "walkingSide",  -1, walking_Speed, 0 );
          } else if (vm.walkingInfo.direction === "up") { //walk up
              moveAnnieManagment( "walkingUp",  0, 0, -walking_Speed );
          } else if (vm.walkingInfo.direction === "down") { //walk down
              moveAnnieManagment( "walkingDown",  0, 0, walking_Speed );
          }
        } else if (!vm.walkingInfo.walking) {

            if (vm.walkingInfo.direction === "left") {
                moveAnnieManagment( "standingSide",  1, 0, 0 );
            } else if (vm.walkingInfo.direction === "right") {
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
        }
      }

      function moveAnnieManagment( animation,  mirrorValue, Xvelocity, yVelocity ){
        if(mirrorValue!=0){
          annieSprite.mirrorX(mirrorValue);
        }
        annieSprite.changeAnimation(animation);
        annieSprite.velocity.x = Xvelocity;
        annieSprite.velocity.y = yVelocity;
      }
      /*=============== add all animations: Parameters(character definition from the char animation service, global characterSprite) ============== */
      function addAnimations(characterDefinition, characterSprite) {
        for (var animationKey in characterDefinition.animations) {
          var frames = [animationKey];
          frames = frames.concat(characterDefinition.animations[animationKey]);
          characterSprite.addAnimation.apply(characterSprite, frames);
        }
      }

      /*================================== collision functions   =========================================*/
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
          });
        });
        if (!hasCollidedWithNonDoor) {
          lastGoodAnniePos.x = annieSprite.position.x;
          lastGoodAnniePos.y = annieSprite.position.y;
        } else {
          annieSprite.position.x = lastGoodAnniePos.x;
          annieSprite.position.y = lastGoodAnniePos.y;
        }
      }

      function handleDoorCollision(furnitureItem) {
          var getNextRoom = mappingService[currentRoomKey][furnitureItem];
          previousRoom = currentRoomKey;
          createRoom(getNextRoom);
      }
      /*================================== Create Room Function =========================================*/
      function createRoom(roomKey) {
        myp5.remove();
        myp5 = null;
        $timeout(function() {
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

      /*================================== dialog functions   =========================================*/

      function dialogTriggered(spriteA, spriteB) {
        vm.walkingInfo.walking = false;
        var characters = vm.main.roomData;
        lastCharCollidedInto = spriteB;
        if (conversationResetBubble.visible) {
          return;
        }
        if (characters && characters[spriteB.name]) {
          var character = characters[spriteB.name];
          if (annieSprite.position.x > spriteB.position.x) {
            vm.main.flipDialogs = false;
          } else {
            vm.main.flipDialogs = true;
          }
          if (character.dialogKey && !annie_Talking) {
            vm.main.convoAttemptsTotal += 1;
            if (vm.main.completedConvos.indexOf(character.dialogKey) >= 0) { //if already completed a convo
              if (character.secondConvo && vm.main.completedConvos.indexOf(character.secondConvo.dialogKey) < 0) { // if there's a second conversation and hasn't been completed
                vm.main.currentConversation = character.secondConvo.dialogKey;
                vm.main.talkingWith = spriteB.name;
                vm.main.hideDialog = false;
                annie_Talking = true;
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
        } else {
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

      function checkRoomDialogs(character) {
        if(typeof vm.main.roomData != 'undefined'){  //TODO in angular
          // if(angular.isUndefined( vm.main.r roomData)){ return } then else --- no need
        var characterDialog = vm.main.roomData[character];
          if (characterDialog && characterDialog.dialogKey) {
            if (vm.main.completedConvos.indexOf(characterDialog.dialogKey) >= 0) {
              if (characterDialog.secondConvo && vm.main.completedConvos.indexOf(characterDialog.secondConvo.dialogKey) < 0) {
                return true;
              }
            } else { //if first convo
              return true;
            }
          } else {
            return false;
          }
        }
      }

      function resetBubble(xVal, yVal, boolVal){
        conversationResetBubble.position.x =xVal + 5;
        conversationResetBubble.position.y = yVal - 140;
        conversationResetBubble.visible = boolVal;

      }


      $log.log('controller adding watches...', roomEntryCount);

      /*================================== watchers  =========================================*/

      $scope.$watch(function() {return showPointsBubble;  }, function(newVal, oldVal) {
        if (newVal != oldVal) {
          currentRoom.drawPointsBubble(vm.main.totalConvoPoints, lastCharCollidedInto);
        }
      });
      $scope.$watch(function() {return vm.main.hideDialog;  }, function(newVal, oldVal) {
        if (currentRoom) {
          if (vm.main.hideDialog !== oldVal && newVal) {
            vm.main.playerScore += vm.main.totalConvoPoints;
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
            if (!vm.main.lastConversationSuccessful) {
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
                if (vm.main.areDialogsCompleted(vm.main.levelConvosNeeded, vm.main.completedConvos)) {
                      vm.main.levelCount += 1;
                  if(  vm.main.levelCount <= levelDataHandler.maxLevel ){
                    vm.main.nextLevelData();
                  }
                }
              }, 2000);
              resetArrowTimer();
            }
          }
           annie_Talking = false;
        }
      });

//TODO is it ok to move this here - ? from what I can see there isnt anything much but a small delay after winning the game --
      $scope.$watch(function() { return vm.main.levelCount;}, function(newVal, oldVal) {
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Game_Setup", vm.main.levelCount, "0/3/5");
        levelRequiredConvos = vm.main.arrayToString(vm.main.levelConvosNeeded);
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Game_State", levelRequiredConvos);
        if (vm.main.levelCount > levelDataHandler.maxLevel) { /* END GAME CHECK*/
          userDataService.trackAction("Game end", vm.main.roomKey, "Game_End", vm.main.playerScore, "0");
          userDataService.postData();
          userGameInfo.playerScore = vm.main.playerScore;
          userGameInfo.totalConvos = vm.main.completedConvos.length;
          $timeout(function() {
            $state.go("endScreen");
          }, 1000);
          return;
        }
        if (currentRoom && newVal != oldVal) {
          currentRoom.getDoorStatus();
        }
      });
    } //end of controller
  } //end of game manager/file
})();
