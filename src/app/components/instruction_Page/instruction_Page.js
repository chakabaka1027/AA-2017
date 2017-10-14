(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('instructionPage', instructionPage);

  /** @ngInject */
  function instructionPage($location, userDataService, $log, $state, dialogService, userGameInfo) { //$log parameter goes in here
    var directive = {
      restrict: 'E',
      templateUrl: "app/components/instruction_Page/instruction_Page.html",
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
      vm.next = next;
      vm.clickCounter = 0;
      vm.getVersion = getVersion;

      vm.isLoading = true;
      dialogService.loadedPromise.then(function() { //if thi swas sesolved vmloading = true else false immeditly
        vm.isLoading = false;

        $log.warn('auto skipping intro!!!');
        $state.go("awkwardAnnieGame");

      });

      function getVersion() {
        if (userGameInfo.gameType.indexOf("positive") === 0) {
          return false;
        } else {
          return true;
        }    }

      function next() {
        vm.clickCounter += 1;
        userDataService.trackAction(vm.levelCount, "Start", "Game_Start", "Game Start");
        if (vm.clickCounter >= 2) {

          $state.go("awkwardAnnieGame");
        }
      }
    } // end of introController
  }
})();
