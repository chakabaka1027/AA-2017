(function() {
  'use strict'; //add to this

  angular.module('awkwardAnnie')
    .directive('displayDialog', displayDialog);

  /** @ngInject */
  function displayDialog($log, conversationP5Data, parseAAContentService, nodeDataService, dialogService, audioService, mainInformationHandler, dialogOptions, userDataService, levelDataHandler) {
    return {
      restrict: 'E',
      controller: controller,
      scope: {
        main: "=",
        isTestBed: "="
      },
      controllerAs: 'vm',
      bindToController:true,
      templateUrl: 'app/components/displayDialog/displayDialog.html'
    };
//TODO   //do animations- done - timers - done - tracking on my way
// score ( mini is done - done - but one issue remains-  level progression needed ! next
//remove redundency

    function controller($scope, $timeout) {
      var vm = this; //positive gives true negative gives false
      vm.choiceDelay = true;
      vm.dialogKey = vm.main.currentConversation;
      vm.curNode = undefined;
      vm.showNode = vm.clickOnChoice = clickOnChoice; // same as saying public funcitn click on choice
      vm.clickContinue = clickContinue;
      vm.chosenAnnie = "";
      vm.npcResponse = "";

      var pc_Text_Timer = 350;
      var pc_npc_timer = pc_Text_Timer + 400;
      var mild_Animation_Timer = 1000;
      var noExpression_Timer = 700;

      var decisionPath = "";
      var successfulConvos;
      var scores = levelDataHandler.choiceScores;
      mainInformationHandler.totalConvoPoints = 0;

      setupForNode();


      function setupForNode() {
        vm.currentNodeChoices = [];
        if (vm.curNode) {
          angular.forEach(vm.curNode.children, function(child) {
            vm.currentNodeChoices.push({choice:child.choiceCode, node: child});
          });
          shuffle(vm.currentNodeChoices);
          vm.showContinue = vm.currentNodeChoices.length===0;
          if (vm.showContinue) {
            $log.log('---Success: '+vm.curNode.success+'; Score '+vm.curNode.score); //here calculate score
          if(vm.curNode.success ){
            mainInformationHandler.totalConvoPoints += vm.curNode.score; //TODO - mark as completed convo here
          }
          }
        }
      }

      $scope.$watch(function(){return vm.main.currentConversation;}, function() {
        vm.dialogKey = vm.main.currentConversation;
        console.log("in watch ",vm.dialogKey);

        if(vm.dialogKey){
          nodeDataService.parseFromDialogTree(vm.dialogKey).then(function(curTree){
            console.log("-------- did this happen ",curTree);
            vm.curTree = curTree;
            vm.curNode = vm.curTree.rootNode;
            setupForNode();
        });
      }

      });

      function clickOnChoice(choice) {
        // scoring, tracking etc. happens; then...
    		var chosenNode = vm.curNode.children[choice];
    		vm.curNode = chosenNode;
        console.log("clicked on a choice!", chosenNode.code);
        audioService.playAudio("UIbuttonclick-option2.wav");
        decisionPath = chosenNode.code; //have to reset this later 0 this will be wrong - how can i acsess the node itself - NOICE 0 got it 'chosenNode' do bot forget  - gotta love 2 am coding and talking to myself :)
        if(vm.curNode.success){         //sucsess or failure -
          console.log("WOOT");
          mainInformationHandler.lastConversationSuccessful = true;
        } else {
          mainInformationHandler.lastConversationSuccessful = false;
          mainInformationHandler.failedConvos[mainInformationHandler.currentConversation] += 1;
        }
        loadResponses(chosenNode);
        setupForNode();
    	}//end of clickOnChoicechoice


      function setUpDelayChoiceDisplay(choice) {
        audioService.playAudio("UIbuttonclick-option1.wav");
        vm.npcResponse = choice.npcText;
        delayChoiceDisplay();
      }



      // function employSpecficTimeOut(animationTitle, choice) {
      //
      //   var pc_Text_Timer = 350;
      //   var pc_npc_timer = pc_Text_Timer + 400;
      //   var mild_Animation_Timer = 1000;
      //   var noExpression_Timer = 700;
      //
      //   var timeOut = noExpression_Timer;
      //
      //   if (animationTitle.indexOf("mild") >= 0){
      //     timeOut = mild_Animation_Timer;
      //   }
      //   else if  (animationTitle.indexOf("bold") >= 0){
      //     timeOut = mild_Animation_Timer;
      //   }
      //
      //   $timeout(function() {
      //     console.log("timer in play! for "+ timeOut);
      //     // setUpDelayChoiceDisplay(choice);
      //     delayChoiceDisplay()
      //   }, timeOut);
      // }

      function clickContinue() { //move this ?
          dialogOptions.hideDialog = true;
          dialogOptions.animationTitle = "";
          vm.showContinue = false;
          vm.curNode.npcText = true; //added this
          // vm.showNPCbubbleText = true;
          // vm.NPC_responseHidden = true;
          //data tracking -
        trackDataAtEndofConvo();
        // chooseDialogScript();
      // vm.main.branchHistory = [];
      // vm.main.currentChoiceInfo = {};
  } // end of click countue

//to use uf needed : npcText
//        pcText
//get game type and do it for postive andnegative --- below just for testing fow now - pr another way?

  function loadResponses(choice) { //log way of doing this not sure if We should do it this way? as they are seprate now and not a single animaiton property of node
      vm.main.currentChoiceInfo = choice;
      vm.npcResponse = "";
      vm.choiceDelay = false;

      $timeout(function() {
        vm.chosenAnnie = choice.pcText;
      }, pc_Text_Timer);

      $timeout(function() {
        if (choice.animation === '' || conversationP5Data[dialogOptions.talkingWith].animations[choice.animation]) {
          dialogOptions.animationTitle = choice.animation;
        } else {
          $log.warn('there is no animation "' + choice.animation + '" for character ' + dialogOptions.talkingWith);
          dialogOptions.animationTitle = '';
        }
        if (dialogOptions.animationTitle && dialogOptions.animationTitle.indexOf("bold") >= 0) {
          var watchPromise = $scope.$watch(function() {
                return dialogOptions.animationDone;
              }, function() { if (dialogOptions.animationDone) {
              audioService.playAudio("UIbuttonclick-option1.wav");
              vm.npcResponse = choice.npcText;
              delayChoiceDisplay();
              watchPromise();
            }
          });
          if (vm.isTestBed) {
            setUpDelayChoiceDisplay(choice);
            watchPromise();
          }
          dialogOptions.animationDone = false; //reset
        } else if (dialogOptions.animationTitle && dialogOptions.animationTitle.indexOf("mild") >= 0) {
          employSpecficTimeOut (mild_Animation_Timer, choice);
        }
         else { //if no animation
           employSpecficTimeOut (noExpression_Timer, choice);
         }
        // return;
      }, pc_npc_timer);
      vm.chosenAnnie = "";
      vm.npcResponse = "";
    }//end of load responces

    function employSpecficTimeOut(timeOut, choice) {
      $timeout(function() {
        setUpDelayChoiceDisplay(choice);
      }, timeOut); }

    function delayChoiceDisplay() {
      $timeout(function() {
        vm.choiceDelay = true;
      }, 1200);
    }


  function delayChoiceDisplay() {
    $timeout(function() {
      vm.choiceDelay = true;
    }, 1200);
  }

  function shuffle(choices) {

    if (!vm.isTestBed) {
      for (var j, x, i = choices.length; i; j = Math.floor(Math.random() * i), x = choices[--i], choices[i] = choices[j], choices[j] = x);
    }
    return choices;
  }

    function resetDialog() {
      decisionPath = "";
      // randomChoices = [];
      successfulConvos;
      scores = levelDataHandler.choiceScores;
      vm.choiceDelay = true;
      mainInformationHandler.totalConvoPoints = 0;
      vm.showContinue = false;
    }

    function trackDataAtEndofConvo(){           //UGLY
      if (mainInformationHandler.lastConversationSuccessful) {
        userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "convo_result", mainInformationHandler.totalConvoPoints, decisionPath);
        userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "convo_end", mainInformationHandler.currentConversation, "Success");
      } else {
        userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "convo_result", mainInformationHandler.totalConvoPoints, decisionPath);
        userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "convo_end", mainInformationHandler.currentConversation, "Fail");
      }
      userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "NPC_state", dialogOptions.talkingWith);
      var progressBarInfo = Math.round((mainInformationHandler.completedConvos.length / mainInformationHandler.totalConvosAvailable) * 100);
      userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "Player_State", mainInformationHandler.playerScore + mainInformationHandler.totalConvoPoints, progressBarInfo);
      successfulConvos = mainInformationHandler.completedConvos.length; //remove var and define above
      userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "Game_convo", successfulConvos, mainInformationHandler.convoAttemptsTotal);
      userDataService.postData(); //Post data after convo is over
    }
}//end of controller
}
})();
