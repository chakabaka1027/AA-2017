(function() {
  'use strict'; //add to this

  angular.module('awkwardAnnie')
    .directive('displayDialog', displayDialog);

  /** @ngInject */
  function displayDialog($log, conversationP5Data, parseAAContentService, dialogService, 
                  audioService, mainInformationHandler, dialogOptions, userDataService, levelDataHandler) {
    return { //removed nodeDataService - injector issue
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
// done - score ( mini is done - done - but one issue remains-  level progression needed ! next
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
      // var successfulConvos; not needed
      var scores = levelDataHandler.choiceScores;
      mainInformationHandler.totalConvoPoints = 0;



      //for data tracking - not sure if really required by ETS or for keepsaking somehwere
      vm.main.branchHistory = [];
      var randomChoices = [];


      setupForNode();


      function setupForNode() {
        $log.log('setupForNode');
        $log.log(vm.curNode);

        if (vm.isTestBed) {
          // for extra feedback when using dialogTestBed...
          vm.main.curNode = vm.curNode;
          vm.main.testValues = levelDataHandler.choiceScores;
          vm.main.count = 0;
          // console.log("~~~~~~~~~~~~~",vm.main.testValues );//[vm.main.curNode.choiceCode]
        }

        vm.currentNodeChoices = [];
        if (vm.curNode) {
          angular.forEach(vm.curNode.children, function(child) {
            vm.currentNodeChoices.push({choice:child.choiceCode, node: child});
          });
          vm.currentNodeChoices.sort(function(a,b){return (a.choice<b.choice ? -1 : 1)});
          shuffle(vm.currentNodeChoices);
          randomChoices = shuffle(vm.currentNodeChoices); //TODO double check
          vm.showContinue = vm.currentNodeChoices.length===0; // length 0 means this is a leaf node
          if (vm.showContinue) {
            $log.log('---Success: '+vm.curNode.success+'; adding to toal score '+vm.curNode.score); //here calculate score
            mainInformationHandler.totalConvoPoints += vm.curNode.score; 
            if(vm.curNode.success ){
              //TODO - mark as completed convo here
            } else {/////////~~~~~~~~~~~~~~~~~~~~~``
              console.log("FAILED----- NEEDS TO GO HERE ");
              mainInformationHandler.failedConvos[mainInformationHandler.currentConversation] += 1; //or betrer to check this with leaf node?
              mainInformationHandler.lastConversationSuccessful = false;

            }
          }
        }
      }

      $scope.$watch(function(){return vm.main.currentConversation;}, function() {
        vm.dialogKey = vm.main.currentConversation;
        
        if (angular.isUndefined(mainInformationHandler.failedConvos[vm.dialogKey])) {
          mainInformationHandler.failedConvos[vm.dialogKey] = 0;
        }

        // console.log("in watch in displayD",vm.dialogKey);

        if(vm.dialogKey){
          if (angular.isUndefined(parseAAContentService.parsedContent[vm.dialogKey])) {
            alert('There is no dialog information for dialog "'+vm.dialogKey+'"!!!. Check your spelling and especially capitalization.');
            dialogOptions.hideDialog = true;
            dialogOptions.animationTitle = "";
            vm.showContinue = false;
            return;
          }
          vm.curTree = parseAAContentService.parsedContent[vm.dialogKey].dialogTree ;

          vm.curNode = vm.curTree.rootNode;
          setupForNode();
          vm.npcResponse = vm.chosenAnnie = "";
          // console.log("------>   vm.curTree",  vm.curTree);
        }

      });

      function clickOnChoice(choice) {
        // scoring, tracking etc. happens; then...
    		var chosenNode = vm.curNode.children[choice];
    		vm.curNode = chosenNode;

        console.log("clicked on a choice!", chosenNode.code);
        audioService.playAudio("UIbuttonclick-option2.wav");
        decisionPath = chosenNode.code; //have to reset this later 0 this will be wrong - how can i acsess the node itself - NOICE 0 got it 'chosenNode' do bot forget  - gotta love 2 am coding and talking to myself :)
        
        if(vm.curNode.success && !vm.isTestBed){         //sucsess or failure -
          console.log("WOOT");
          mainInformationHandler.lastConversationSuccessful = true;
          //TODO MOVED THIS HERE - LOGICALLY WORKS BUT DOUBLE CHECK - as this happens once at the end of a convo ( old script in node 3 )
          mainInformationHandler.completedConvos.push(mainInformationHandler.currentConversation); // === where should htis one be ?
          mainInformationHandler.totalConvoPoints = 0;
          console.log(mainInformationHandler.completedConvos);
        } else {
          $log.warn('clickOnChoice: Player failed conversation - should this commented code be done here or in setupForNode?');
        //   // //TODO verify this - if move is ok
        //   // mainInformationHandler.failedConvos[mainInformationHandler.currentConversation] += 1; //or betrer to check this with leaf node?
        //   // mainInformationHandler.lastConversationSuccessful = false;
        }


        loadResponses(chosenNode);
        setupForNode();
        if(!vm.main.isTestBed){
          trackBranches(chosenNode.code);
          // console.log("testing values for data tracking " + chosenNode.code + " " +chosenNode +" " + chosenNode.code.length );
          dataTracking(chosenNode.code, chosenNode,chosenNode.code.length+1 );
        }

    	}//end of clickOnChoicechoice


      function setUpDelayChoiceDisplay(choice) {
        audioService.playAudio("UIbuttonclick-option1.wav");
        vm.npcResponse = choice.npcText;
        delayChoiceDisplay();
      }

      function clickContinue() { //move this ?
        $log.log('clickContinue');
        dialogOptions.hideDialog = true;
        dialogOptions.animationTitle = "";
        vm.showContinue = false;
        // vm.curNode.npcText = true; //added this
        // vm.showNPCbubbleText = true;
        // vm.NPC_responseHidden = true;
        
        //data tracking -
        if(!vm.isTestBed) {
          trackDataAtEndofConvo();
        } else {
          // for test bed, reset the dialog to the beginning...
          vm.curTree = parseAAContentService.parsedContent[vm.dialogKey].dialogTree ;

          vm.curNode = vm.curTree.rootNode;
          setupForNode();
          vm.npcResponse = vm.chosenAnnie = "";

        }

        // chooseDialogScript();
        // vm.main.branchHistory = [];
        // vm.main.currentChoiceInfo = {};

      } // end of click countue

      //to use uf needed : npcText
      //TO ADD -> decisionPath = chosenNode.code;


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
              var watchPromise = $scope.$watch(function() {return dialogOptions.animationDone;}, function() { 
                if (dialogOptions.animationDone) {
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
            } else { //if no animation
               employSpecficTimeOut (noExpression_Timer, choice);
             }
          }, pc_npc_timer);

          vm.chosenAnnie = "";
          vm.npcResponse = "";
        } //end of loadResponses

        function employSpecficTimeOut(timeOut, choice) {
          $timeout(function() {
            setUpDelayChoiceDisplay(choice);
          }, timeOut); 
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
          randomChoices = [];
          var successfulConvos;
          scores = levelDataHandler.choiceScores;
          vm.choiceDelay = true;
          mainInformationHandler.totalConvoPoints = 0;
          vm.showContinue = false;
        }

        function trackDataAtEndofConvo() {           //UGLY
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

        function trackBranches(currentBranch) {
          vm.main.branchHistory.push(currentBranch);
        }

        function dataTracking(Branch, choice, number) { //need to checj older versions if "strings" changed -
          var num = number.toString();
          var str = ["convo_state","convo_user","convo_system","convo_NPC"];
          var pram3 = [num,Branch,scores[Branch],choice.animation];
          var pram4 = [mainInformationHandler.failedConvos[mainInformationHandler.currentConversation],choice.PC_Text,randomChoices.indexOf(choice) + 1,choice.NPC_Response];
          setTrackAction(str, pram3, pram4);
        }

        function setTrackAction(strings, parm3, parm4){
          var stringArr = strings;
          var thirdParmValues = parm3;
          var forthPramValues = parm4;
          for (var i = 0; i < stringArr.length; i++){
            userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, stringArr[i] , thirdParmValues[i], forthPramValues[i]);  //text_position
          }
        }


    }//end of controller

  }
})();
