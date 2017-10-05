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
      vm.clickContinue = clickContinue;
      vm.showNode = showNode; //instead of shownode2,3
      vm.showNode3Response = showNode3Response;
      vm.chosenAnnie = "";
      vm.npcResponse = "";
      vm.node1Hidden = false;
      vm.node2Hidden = true;
      vm.node3Hidden = true; // vm.hiddenNodes ={ node1: false, node2:true, node3: true - holds same in memeory just reads better --- thoughts?  } //or array of bools?
      vm.node3Response = true;

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
        HideNodes(false, true, true);
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
          vm.main.isLinearDialog = vm.choice.length === 1;
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
        HideNodes(false, true, true);
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
            var watchPromise = $scope.$watch(function() {
              return vm.main.animationDone;
            }, function() {
              if (vm.main.animationDone) {
                latestChoice = choice;
                audioService.playAudio("UIbuttonclick-option1.wav");
                vm.npcResponse = choice.NPC_Response;
                delayChoiceDisplay();
                watchPromise(); //get's rid of previously created $watch
              }
            });

            //displays responses in the test bed when dialog is complete for awkward convos
            if (vm.isTestBed) {
              latestChoice = choice;
              temp(choice);
              watchPromise(); //get's rid of previously created $watch
            }
            vm.main.animationDone = false; //reset
          } else if (vm.main.animationTitle && vm.main.animationTitle.indexOf("mild") >= 0) { //if mild expression
            $timeout(function() {
              temp(choice);
            }, mild_Animation_Timer);
          } else { //if no animation
            $timeout(function() {
              temp(choice);
            }, noExpression_Timer);
          }
          // return;
        }, pc_npc_timer); //wait after PC text is shown + extra
        vm.chosenAnnie = "";
        vm.npcResponse = "";
      }

      function delayChoiceDisplay() {
        $timeout(function() {
          vm.choiceDelay = true;
        }, 1200);
      }
      //works -  new methods ----
      function showNode(nodeType, choice) { //momentary for testing
        audioService.playAudio("UIbuttonclick-option2.wav");
        var codeNode = choice.code; //in both 2 and 3
        if (nodeType == 2) {
          HideNodes(true, false, true);
          vm.npcResponse = "";
          var currenBranch = adjustNodeandReturnBranch(dialogRoot.node2[codeNode], 2, choice, 0);
          dataTracking(currenBranch, choice, 1);
        } else if (nodeType == 3) {
          HideNodes(true, true, false);
          var currenBranch = adjustNodeandReturnBranch(dialogRoot.node3[codeNode], 3, choice, 1);
          dataTracking(currenBranch, choice, 2);
        }
        loadResponses(choice);
        trackBranches(currenBranch);
      }

      function adjustNodeandReturnBranch(nodecContent, nodeType, choice, choiceNumber) {
        var orignalNode = nodecContent;
        if (nodeType == 3) {
          vm.choice3 = orignalNode; //change this to vm.node+1 and have it as an array ?
        } else {
          vm.choice2 = orignalNode;
        }
        randomChoices = shuffle(orignalNode); //issue ?
        return choice.code.charAt(choiceNumber);
      }

      function HideNodes(node1, node2, node3) {
        vm.node1Hidden = node1;
        vm.node2Hidden = node2;
        vm.node3Hidden = node3;
      }

      function dataTracking(Branch, choice, number) { //need to checj older versions if "strings" changed - they looked the same to me but need to verify as l 161 os diff
        var num = number.toString(); //node 3 had the same thing
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_state", num, vm.main.failedConvos[vm.main.currentConversation]);
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_user", Branch, choice.PC_Text);
        if (!vm.isTestBed) {
          userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_system", scores[Branch], randomChoices.indexOf(choice) + 1);
        }
        userDataService.trackAction(vm.main.levelCount, vm.main.roomKey, "convo_NPC", choice.animation, choice.NPC_Response); //text_position
      }

      function temp(choice) { //not sure why it is used thw way it is up there - for now just moving it here to avoid repeating it
        audioService.playAudio("UIbuttonclick-option1.wav"); //even has the same exact values above
        vm.npcResponse = choice.NPC_Response;
        delayChoiceDisplay();
      }
    }
    //end of controller
  }
})();
