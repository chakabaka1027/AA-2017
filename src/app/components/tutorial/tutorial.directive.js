(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .directive('simpleTutorial', simpleTutorial);


  function simpleTutorial($log, $timeout, audioService, $http, tutorialService) {

    return {
      restrict: 'E',
      controller: controller,
      bindToController: true,
      controllerAs: 'tut',
      templateUrl: 'app/components/tutorial/tutorial.html'
    };

    function controller($scope) {
      var vm = this;
      var scrollTimer;
      var showTimer;
      var hideTimer;
      vm.showingNPCtext = false;
      vm.showingDialogOptions = false;
      vm.textRows = [];
      vm.curState = '';
      vm.curStateName = '';
      vm.gotoState = gotoState;
      vm.resetState = resetState;
      delayDialog();

      tutorialService.loadTutorialData().then(function() {
        vm.resetState();
      });
      $scope.$on("$destroy", onDestroy);

      function gotoState(pcOption) {
        audioService.playAudio("UIbuttonclick-option2.wav");
        vm.textRows.push({
          npcText: vm.curState.npcText,
          pcText: pcOption.text
        });
        vm.curStateName = pcOption.nextState;
        vm.curState = tutorialService.data[vm.curStateName];
        delayDialog();
        vm.showingNPCtext = false;
        vm.showingDialogOptions = false;
        $timeout(function() {
          $('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
        }, 10);

        $timeout.cancel(scrollTimer);
        scrollTimer = $timeout(function() {
          $('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
        }, 1500);

      } //end of method

      function resetState() {
        vm.curState = tutorialService.data.start;
        vm.curStateName = 'start';
      }

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
