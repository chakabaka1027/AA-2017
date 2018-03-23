(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('instructionPage', instructionPage);

  /** @ngInject */
  function instructionPage($location, userDataService, $log, $state, dialogService, userGameInfo, parseAAContentService) { //$log parameter goes in here
    var directive = {
      restrict: 'E',
      templateUrl: "app/components/instructionPage/instructionPage.html",
      scope: {
        main: "="
      },
      controller: introController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    /** @ngInject */
    function introController() {
      var vm = this;
      var gameCaseData;

      vm.state = 'loading';

      vm.gameIsPositive = gameIsPositive;
      vm.nextClicked = nextClicked;

      vm.isLoading = true;
      dialogService.loadedPromise.then(function() { //if thi swas sesolved vmloading = true else false immeditly
        vm.isLoading = false;

        gameCaseData = parseAAContentService.getLevelDataForURL();
        $log.log(gameCaseData);

        if (!gameCaseData.tutorial && !gameCaseData.instructions) {
          $log.log('instructionPage: skipping instructions and intro');
          $state.go("awkwardAnnieGame");
          return;
        }

        if (gameCaseData.tutorial) {
          vm.state = 'tutorial';
        } else {
          vm.state = 'instructions';
        }

      });

      function gameIsPositive() {
        if (userGameInfo.gameType.indexOf("positive") === 0) {
          return false;
        } else {
          return true;
        }    
      }

      function nextClicked() {

        userDataService.trackAction(vm.levelCount, "Start", "Game_Start", "Game Start");
        
        $log.log('instructionPage: nextClicked with state "'+vm.state+'"');

        if (vm.state==='instructions' || !gameCaseData.instructions) {
          $state.go("awkwardAnnieGame");
        } else {
          vm.state = 'instructions';
        }
      }
    } // end of introController
  }
})();
