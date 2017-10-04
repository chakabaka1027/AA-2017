(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .directive('simpleTutorial', simpleTutorial);
		//remove below - couldn't do it
  var posStates = { //moving to json
    start: {
      npcText: ' Hi, Annie, Welcome to your first day at work..',
      pcOptions: [{
        text: 'Thanks, but I\’m a bit nervous about saying the wrong things to people.',
        nextState: 's1'
      }]
    }
  };

  var negStates = {
    start: {
      npcText: 'Hi, Annie, Welcome to your first day at work.',
      pcOptions: [{
        text: 'Thanks, but I\’d rather be at home playing video games.',
        nextState: 's1'
      }]
    }
  };


  function simpleTutorial($log, $timeout, audioService, $http, IntroService, userGameInfo) {

    return {
      restrict: 'E',
      controller: controller,
      bindToController: true,
      controllerAs: 'tut',
      templateUrl: 'app/components/tutorial/tutorial.html'
    };

    function controller($scope, $stateParams) {
      var vm = this;
      var positivePath = "assets/tutorialJson/positiveIntro.json";
      var negativePath = "assets/tutorialJson/negativeIntro.json";
      var path;
      var gameType = userGameInfo.gameType;

      //attempt 2 - service alone failed - try agian tomorrow ---

      vm.showingNPCtext = false;
      vm.showingDialogOptions = false;
      var scrollTimer;
      var showTimer;
      var hideTimer;

      delayDialog();


      if (gameType.indexOf("positive") === 0) {
        path = positivePath;
        gameType = true;
      } else {
        path = negativePath;
        gameType = false;

      }

      $http.get(path).then(function(response) {
        $scope.d = response.data;
      }).catch(function() {
        $log.log("error - cannot read file");
      });

      vm.gotoState = function(pcOption) { //why can i acsess scope d here but not inside other function -? scope issue ?
        // IntroService.testingPromise();
        audioService.playAudio("UIbuttonclick-option2.wav");
        vm.textRows.push({
          npcText: vm.curState.npcText,
          pcText: pcOption.text
        });
        vm.curState = $scope.d[pcOption.nextState]; //posStates[pcOption.nextState];
        vm.curStateName = $scope.d[pcOption.nextState]; //needed in view - added a temp sul
				vm.t = Object.values(vm.curStateName); //long workaround -
        delayDialog();
        vm.showingNPCtext = false;
        vm.showingDialogOptions = false;
        //scroll after pc and npc response
        $timeout(function() {
          $('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
        }, 10);

        $timeout.cancel(scrollTimer);
        scrollTimer = $timeout(function() {
          $('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
        }, 1500);

      } //end of method


			vm.resetState = function() { //couldnt figure out using the varible outside of scope -scope.d is undefined in this scope - async
				vm.textRows = [];
				if (gameType) {
					vm.curState = posStates['start']; //load all json into a service then acsess them from here and change this one
				} else {
					vm.curState = negStates['start'];
				}
				vm.curStateName = 'start';
			}

      vm.resetState();
      $scope.$on("$destroy", onDestroy);

      function delayDialog() {

        $timeout.cancel(showTimer);
        showTimer = $timeout(function() {
          vm.showingNPCtext = true;
          audioService.playAudio("UIbuttonclick-option1.wav");
        }, 1500);

        $timeout.cancel(hideTimer);
        hideTimer = $timeout(function() {
          vm.showingDialogOptions = true;
        }, 2500);

      }

      function onDestroy() {
        $timeout.cancel(showTimer);
        $timeout.cancel(hideTimer);
        $timeout.cancel(scrollTimer);
      }
    }
  }
})();
