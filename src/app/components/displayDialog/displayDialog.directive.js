(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('displayDialog', displayDialog);

  /** @ngInject */
  function displayDialog(dialogService, userDataService, audioService, $log, conversationP5Data, levelDataHandler, mainInformationHandler, dialogOptions) {
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
      var decisionPath = "";
      var randomChoices = [];
      var successfulConvos;
      var scores = levelDataHandler.choiceScores;
      vm.choiceDelay = true;
      mainInformationHandler.totalConvoPoints = 0;
      vm.showContinue = false;
      vm.chosenAnnie = "";
      vm.npcResponse = "";
      vm.currentNodeIndex = 1;
      vm.currentNodeChoices = [];
      vm.node3Response = true;

      vm.clickContinue = clickContinue;
      vm.showNode = showNode;
      vm.showNode3Response = showNode3Response;

      // for debugging in testbed...
      vm.main.branchHistory = [];
      vm.main.currentChoiceInfo = {};

      $scope.$watch(function() {return mainInformationHandler.currentConversation;}, function() {
        resetDialog();
        chooseDialogScript();
      });

      function resetDialog() {
        decisionPath = "";
        randomChoices = [];
        successfulConvos;
        scores = levelDataHandler.choiceScores;
        vm.choiceDelay = true;
        mainInformationHandler.totalConvoPoints = 0;
        vm.showContinue = false;
        vm.chosenAnnie = "";
        vm.npcResponse = "";
        vm.node3Response = true;
      }

      function chooseDialogScript() {
        dialogOptions.animationTitle = "";
        var dialog = mainInformationHandler.currentConversation;
        dialogService.getDialogs(dialog).then(function(data) {
          $log.log('dialogRoot', data);
          dialogRoot = data;
          var originalNodeOne = dialogRoot.node1;
          randomChoices = shuffle(originalNodeOne);
          vm.choice = originalNodeOne;
          vm.choice2 = dialogRoot.node2;
          vm.choice3 = dialogRoot.node3;
          vm.main.isLinearDialog = vm.choice.length === 1;
          vm.currentNodeIndex = 1;
          vm.currentNodeChoices = vm.choice;

        });
        if (angular.isUndefined(mainInformationHandler.failedConvos[mainInformationHandler.currentConversation])) {
          mainInformationHandler.failedConvos[mainInformationHandler.currentConversation] = 0;
        }
      }
      /*=============== Button operations =================*/

      function showNode3Response(choice) {
        audioService.playAudio("UIbuttonclick-option2.wav");
        vm.node3Hidden = true;
        vm.npcResponse = "";
        loadResponses(choice);
        vm.showContinue = true;

        if (!vm.isTestBed) {
          if (levelDataHandler.successPaths.indexOf(choice.code) >= 0) {
            mainInformationHandler.completedConvos.push(mainInformationHandler.currentConversation);
            mainInformationHandler.totalConvoPoints = 0;
            for (var i in choice.code) {
              mainInformationHandler.totalConvoPoints += scores[choice.code[i]];
            }
            mainInformationHandler.lastConversationSuccessful = true;
          } else {
            mainInformationHandler.failedConvos[mainInformationHandler.currentConversation] += 1;
            mainInformationHandler.lastConversationSuccessful = false;
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
        dialogOptions.hideDialog = true;
        vm.chosenAnnie = "";
        vm.npcResponse = "";

        vm.showNPCbubbleText = true;
        vm.NPC_responseHidden = true;
        vm.node3Response = true;
        vm.showContinue = false;
        dialogOptions.animationTitle = "";

        if (!vm.isTestBed) {
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
          successfulConvos = mainInformationHandler.completedConvos.length;
          userDataService.trackAction(mainInformationHandler.levelCount, mainInformationHandler.roomKey, "Game_convo", successfulConvos, mainInformationHandler.convoAttemptsTotal);
          userDataService.postData(); //Post data after convo is over
          chooseDialogScript();
        }
        vm.main.branchHistory = [];
        vm.main.currentChoiceInfo = {};
      }

      /*=============== Functions =================*/
      function shuffle(choices) {
        if (!vm.isTestBed) {
          for (var j, x, i = choices.length; i; j = Math.floor(Math.random() * i), x = choices[--i], choices[i] = choices[j], choices[j] = x);
        }
        return choices;
      }

      function loadResponses(choice) {
        vm.main.currentChoiceInfo = choice;
        vm.npcResponse = "";
        vm.choiceDelay = false;

        $timeout(function() {
          vm.chosenAnnie = choice.PC_Text;
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
                vm.npcResponse = choice.NPC_Response;
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

      function showNode(choice) {
            audioService.playAudio("UIbuttonclick-option2.wav");
            var codeNode = choice.code;
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

          //TODO combine methods -
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

          function setUpDelayChoiceDisplay(choice) {
            audioService.playAudio("UIbuttonclick-option1.wav");
            vm.npcResponse = choice.NPC_Response;
            delayChoiceDisplay();
          }
        } //end of controller
      }
    })();
