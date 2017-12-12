(function() {
  'use strict'; //add to this

  angular.module('awkwardAnnie')
    .directive('displayDialog', displayDialog);

  /** @ngInject */
  function displayDialog($log, conversationP5Data, parseAAContentService, nodeDataService, dialogService, audioService, mainInformationHandler, dialogOptions, userDataService) {
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
//TODO   //do animations! next

    function controller($scope, $timeout) {
      var vm = this;

      vm.choiceDelay = true;
      vm.dialogKey = vm.main.currentConversation;
      vm.curNode = undefined;

      vm.showNode = vm.clickOnChoice = clickOnChoice; // same as saying public funcitn click on choice
      vm.clickContinue = clickContinue;

      var decisionPath = "";
      //timers
      var pc_Text_Timer = 350;
      var pc_npc_timer = pc_Text_Timer + 400;
      var mild_Animation_Timer = 1000;
      var noExpression_Timer = 700;

      //used in old -
      vm.chosenAnnie = "";
      vm.npcResponse = "";

      //check if needed -
      vm.main.currentChoiceInfo = {};



      setupForNode();
      function setupForNode() {
        vm.currentNodeChoices = [];
        if (vm.curNode) { //is this undefined?
          angular.forEach(vm.curNode.children, function(child) {
            vm.currentNodeChoices.push({choice:child.choiceCode, node: child});
          });
          vm.showContinue = vm.currentNodeChoices.length===0;
          if (vm.showContinue) {
            $log.log('---Success: '+vm.curNode.success+'; Score '+vm.curNode.score);  ///// here is where it should calcualte the score ---

            // if(vm.curNode.success){
            //   mainInformationHandler.lastConversationSuccessful = true;  //but this is insde set up! revise your thinking self!
            // } else {
            //   mainInformationHandler.lastConversationSuccessful = true;
            //
            // }

          }
        }
      }

      $scope.$watch(function(){return vm.main.currentConversation;}, function() {
        vm.dialogKey = vm.main.currentConversation;
        console.log("in watch ",vm.dialogKey);

        if(vm.dialogKey){//was commented
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
        // console.log("clicked on a choice!", choice);
    		var chosenNode = vm.curNode.children[choice];
    		vm.curNode = chosenNode;
        console.log("clicked on a choice!", chosenNode.code);
        audioService.playAudio("UIbuttonclick-option2.wav");
        decisionPath = chosenNode.code; //have to reset this later 0 this will be wrong - how can i acsess the node itself - NOICE 0 got it chosenNode - gotta love 2 am coding and talking to myself :)

        //sucsess or failure -
        if(vm.curNode.success){
          console.log("WOOT");
          mainInformationHandler.lastConversationSuccessful = true;  //but this is insde set up! revise your thinking self!
        } else {
          mainInformationHandler.lastConversationSuccessful = false;
          mainInformationHandler.failedConvos[mainInformationHandler.currentConversation] += 1;
        }
        loadResponses(chosenNode);
        // or something silimar - redo next part
        // if (dialogOptions.animationTitle && dialogOptions.animationTitle.indexOf("mild") >= 0) {
        //   employSpecficTimeOut (mild_Animation_Timer, choice);
        // }
        //  else { //if no animation
        //    employSpecficTimeOut (noExpression_Timer, choice);
        //  }
        setupForNode(); //calls set up so did the true/ false in there or here ?

    	}//end of click o choice


      function employSpecficTimeOut(timeOut, choice) {
        $timeout(function() {
          console.log("timer in play! for "+ timeOut);
          // setUpDelayChoiceDisplay(choice);
          delayChoiceDisplay()
        }, timeOut);
      }

      function clickContinue() { //move this ?
          dialogOptions.hideDialog = true;
          dialogOptions.animationTitle = "";
          //data tracking -
        trackDataAtEndofConvo();
        // chooseDialogScript();
      // vm.main.branchHistory = [];
      // vm.main.currentChoiceInfo = {};
  } // end of click countue

//npcText
//pcText
//get game type and do it for postive andnegative --- below just for testing fow now - pr another way?
//aniamtion sample for negative done 
  function loadResponses(choice) {
    vm.main.currentChoiceInfo = choice;
    vm.npcResponse = "";
    vm.choiceDelay = false;

    $timeout(function() {
      vm.chosenAnnie = choice.pcText;
    }, pc_Text_Timer);

    $timeout(function() {
      if (choice.animationNegative=== '' || conversationP5Data[dialogOptions.talkingWith].animations[choice.animationNegative]) {
        dialogOptions.animationTitle = choice.animationNegative;
        console.log("----",dialogOptions.animationTitle);

      } else {
        $log.warn('there is no animation "' + choice.animationNegative + '" for character ' + dialogOptions.talkingWith);
        dialogOptions.animationTitle = '';
      }
      if (dialogOptions.animationTitle && dialogOptions.animationTitle.indexOf("bold") >= 0) {
        var watchPromise = $scope.$watch(function() {
              return dialogOptions.animationDone;
            }, function() { if (dialogOptions.animationDone) {
            audioService.playAudio("UIbuttonclick-option1.wav");
            // vm.npcResponse = choice.NPC_Response;
            employSpecficTimeOut (mild_Animation_Timer, choice);
            // setUpDelayChoiceDisplay(choice);

            // delayChoiceDisplay();
            watchPromise();
          }
        });
        if (vm.isTestBed) {
          // setUpDelayChoiceDisplay(choice);
          employSpecficTimeOut (mild_Animation_Timer, choice);
          watchPromise();
        }
        dialogOptions.animationDone = false; //reset
      } else if (dialogOptions.animationTitle && dialogOptions.animationTitle.indexOf("mild") >= 0) { //this worked - now need to show next button
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



  function delayChoiceDisplay() {
    $timeout(function() {
      vm.choiceDelay = true;
    }, 1200);
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
      var successfulConvos = mainInformationHandler.completedConvos.length; //remove var and define above
      userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "Game_convo", successfulConvos, mainInformationHandler.convoAttemptsTotal);
      userDataService.postData(); //Post data after convo is over
    }
}//end of controller
}
})();
