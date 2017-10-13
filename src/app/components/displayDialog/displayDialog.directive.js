(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('displayDialog', displayDialog);

  /** @ngInject */
  function displayDialog(dialogService, userDataService, audioService, $log, conversationP5Data, levelDataHandler) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/displayDialog/displayDialog.html',
      controller: displayDialogController,
      scope: {
        main: "=",
        isTestBed: "="
      },
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    /** @ngInject */
    function displayDialogController($scope, $timeout) {
      var vm = this;
      var dialogRoot;
      var pc_Text_Timer = 350;
      var pc_npc_timer = pc_Text_Timer + 400;
      var mild_Animation_Timer = 1000;
      var noExpression_Timer = 700;
      var latestChoice = {};
      var npc = "";
      var decisionPath = "";
      var randomChoices = [];
      var successfulConvos;
      var scores = levelDataHandler.choiceScores;
      vm.choiceDelay = true;
      vm.main.totalConvoPoints = 0; //q whsats the point of msin controller then ?
      vm.showContinue = false;
      vm.chosenAnnie = "";
      vm.npcResponse = "";

      vm.currentNodeIndex = 1;
      vm.currentNodeChoices = [];

      vm.node3Response = true;

      vm.clickContinue = clickContinue;
      vm.showNode = showNode; //instead of shownode2,3
      vm.showNode3Response = showNode3Response;

      // for debugging in testbed...
      vm.main.branchHistory = [];
      vm.main.currentChoiceInfo = {};

      $scope.$watch(function() {
        return vm.main.currentConversation;
      }, function() {
        resetDialog();
        chooseDialogScript();

      });

      function resetDialog() {
        npc = "";
        decisionPath = "";
        randomChoices = [];
        successfulConvos;
        scores = levelDataHandler.choiceScores;
        vm.choiceDelay = true;
        vm.main.totalConvoPoints = 0;
        vm.showContinue = false;
        vm.chosenAnnie = "";
        vm.npcResponse = "";
        vm.node3Response = true;
      }

      function chooseDialogScript() {
        npc = vm.main.talkingWith;
        vm.main.animationTitle = "";
        //Get branching conversation data
        var dialog = vm.main.currentConversation;
        dialogService.getDialogs(dialog).then(function(data) {
          dialogRoot = data;
          // save choices to an array
          var originalNodeOne = dialogRoot.node1;
          // Shuffle node one, can't shuffle others until
          randomChoices = shuffle(originalNodeOne);
          // Give new array to DOM
          vm.choice = originalNodeOne;
          vm.choice2 = dialogRoot.node2;
          vm.choice3 = dialogRoot.node3;


          // vm.choices = [null, originalNodeOne, dialogRoot.node2, dialogRoot.node3]
          // later... vm.currentNodeChoice = vm.choices[vm.currentodeIndex]; or something like that...

          vm.main.isLinearDialog = vm.choice.length === 1;

          vm.currentNodeIndex = 1;
          vm.currentNodeChoices = vm.choice;

        });
        if (angular.isUndefined(vm.main.failedConvos[vm.main.currentConversation])) {
          vm.main.failedConvos[vm.main.currentConversation] = 0;
        }
      }
      /*=============== Button operations =================*/

      function showNode3Response(choice) { //choice parameter
        audioService.playAudio("UIbuttonclick-option2.wav");
        vm.node3Hidden = true;
        vm.npcResponse = "";
        loadResponses(choice);
        vm.showContinue = true;

        if (!vm.isTestBed) {
          if (levelDataHandler.successPaths.indexOf(choice.code) >= 0) {
            vm.main.completedConvos.push(vm.main.currentConversation);
            vm.main.totalConvoPoints = 0;
            for (var i in choice.code) {
              vm.main.totalConvoPoints += scores[choice.code[i]];
            }
            vm.main.lastConversationSuccessful = true;
          } else {
            vm.main.failedConvos[vm.main.currentConversation] += 1;
            vm.main.lastConversationSuccessful = false;
          }
        }
        var currenBranch = choice.code.charAt(2);
        trackBranches(currenBranch);
        dataTracking(currenBranch, choice, 3);
        decisionPath = choice.code;
      }

      function trackBranches(currentBranch) {
        vm.main.branchHistory.push(currentBranch);
      }

      function clickContinue() {
        vm.main.hideDialog = true;
        vm.chosenAnnie = "";
        vm.npcResponse = "";

        vm.showNPCbubbleText = true;
        vm.NPC_responseHidden = true;
        vm.node3Response = true;
        vm.showContinue = false;
        vm.main.animationTitle = "";

        // End of convo data - clean up this block - add a set up methof for strings that change
        if (!vm.isTestBed) {
          if (vm.main.lastConversationSuccessful) {
            userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_result", vm.main.totalConvoPoints, decisionPath);
            userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_end", vm.main.currentConversation, "Success");
          } else {
            userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_result", vm.main.totalConvoPoints, decisionPath);
            userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_end", vm.main.currentConversation, "Fail");
          }
          userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "NPC_state", vm.main.talkingWith);
          var progressBarInfo = Math.round((vm.main.completedConvos.length / vm.main.totalConvosAvailable) * 100);

          userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Player_State", vm.main.playerScore + vm.main.totalConvoPoints, progressBarInfo);

          successfulConvos = vm.main.completedConvos.length;
          userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "Game_convo", successfulConvos, vm.main.convoAttemptsTotal);
          userDataService.postData(); //Post data after convo is over
          chooseDialogScript();
        }
        // for debugging in testbed...
        vm.main.branchHistory = [];
        vm.main.currentChoiceInfo = {};

      }

      /*=============== Functions =================*/
      function shuffle(choices) {
        if (!vm.isTestBed) {
          for (var j, x, i = choices.length; i; j = Math.floor(Math.random() * i), x = choices[--i], choices[i] = choices[j], choices[j] = x);
          return choices;
        }
      }

      function loadResponses(choice) {
        // for debugging purposes, added by chas...
        vm.main.currentChoiceInfo = choice;
        vm.npcResponse = ""; // clear response before showing next
        vm.choiceDelay = false;

        $timeout(function() {
          vm.chosenAnnie = choice.PC_Text;
        }, pc_Text_Timer);

        $timeout(function() {
          if (choice.animation === '' || conversationP5Data[vm.main.talkingWith].animations[choice.animation]) {
            vm.main.animationTitle = choice.animation;
          } else {
            $log.warn('there is no animation "' + choice.animation + '" for character ' + vm.main.talkingWith);
            vm.main.animationTitle = '';
          }
          if (vm.main.animationTitle && vm.main.animationTitle.indexOf("bold") >= 0) { //if it has an animated expression, wait until it's done.
            // var npc_vt_anim_timer = vm.main.numberOfFrames * 100; //length of animation
            var watchPromise = $scope.$watch(function() {return vm.main.animationDone;},function() {
              if (vm.main.animationDone) {
                latestChoice = choice;
                audioService.playAudio("UIbuttonclick-option1.wav");
                vm.npcResponse = choice.NPC_Response;
                delayChoiceDisplay();
                watchPromise(); //get's rid of previously created $watch
              }
            }); //end of watch one
            if (vm.isTestBed) {
              latestChoice = choice;
              setUpDelayChoiceDisplay(choice);
              watchPromise(); //get's rid of previously created $watch
            }
            vm.main.animationDone = false; //reset
          } else if (vm.main.animationTitle && vm.main.animationTitle.indexOf("mild") >= 0) { //if mild expression
            employSpecficTimeOut (mild_Animation_Timer, choice); //scope choice isnt avaible outside -
          }
           else { //if no animation
             employSpecficTimeOut (noExpression_Timer, choice);
           }
          // return;
        }, pc_npc_timer); //wait after PC text is shown + extra
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
      //works -  new methods ----
      // suggest combine with adjustNodeandReturnBranch...
      function showNode(choice) { //momentary for testing //---combined
            audioService.playAudio("UIbuttonclick-option2.wav");
            var codeNode = choice.code; //in both 2 and 3
            var orignalNode;
            var currenBranch;
            if (vm.currentNodeIndex == 3) {
              showNode3Response(choice);
              return;
            }
            if (vm.currentNodeIndex == 1) {
              vm.npcResponse = "";
              vm.choice2  = dialogRoot.node2[codeNode];
              currenBranch =  choice.code.charAt(0);
              dataTracking(currenBranch, choice, 1);

            } else if (vm.currentNodeIndex == 2) {
              vm.choice3  = dialogRoot.node3[codeNode];
              currenBranch =  choice.code.charAt(1);
              dataTracking(currenBranch, choice, 2);
            }
            vm.currentNodeIndex += 1;
            vm.currentNodeChoices = shuffle(vm['choice'+vm.currentNodeIndex]);
            loadResponses(choice);
            trackBranches(currenBranch);
          }
          //pit thrdr in one method  0---  use foreach - angularforeach ---
          //rename it to set data track if approved and move below to dataTracking - or should this be a method in user data service?- and name the other to data tracking
          function dataTracking(Branch, choice, number) { //need to checj older versions if "strings" changed - they looked the same to me but need to verify as l 161 os diff
            var num = number.toString(); //2D array -
            var str = ["convo_state","convo_user","convo_system","convo_NPC"];
            var pram3 = [num,Branch,scores[Branch],choice.animation];
            var pram4 = [vm.main.failedConvos[vm.main.currentConversation],choice.PC_Text,randomChoices.indexOf(choice) + 1,choice.NPC_Response];
            setTrackAction(str, pram3, pram4);

          }
          //not sure if this is required ? --- a long workaround for the same thing
          function setTrackAction(strings, parm3, parm4){ //saves about 3 lines above - thoughts ? sample use below in comments
            var stringArr = strings;     // exampme this will be substritued by strings
            var thirdParmValues = parm3; //var stringArr = ["test1","2","3","4"]; sample use ---
            var forthPramValues = parm4;
            for (var i = 0; i < stringArr.length; i++){
              userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, stringArr[i] , thirdParmValues[i], forthPramValues[i]);  //text_position
          }
        }
        //
          function setUpDelayChoiceDisplay(choice) { //not sure why it is used thw way it is up there - for now just moving it here to avoid repeating it
            audioService.playAudio("UIbuttonclick-option1.wav");
            vm.npcResponse = choice.NPC_Response;
            delayChoiceDisplay();
          }
        } //end of controller
      }
    })();
