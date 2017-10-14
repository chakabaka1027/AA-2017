(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('endScreen', endScreen);

  /** @ngInject */
  function endScreen(userDataService, userGameInfo, $window, levelDataHandler, $state) {
    var directive = {
      restrict: "E",
      templateUrl: "app/components/endScreenManager/endScreenTemplate.html",
      scope: {
        main: "="
      },
      controller: controller,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    /** @ngInject */
    function controller($scope, $log, $location) {
      var vm = this;
      vm.quit = quit;
      vm.userID = userDataService.userID;
      vm.playerScore = userGameInfo.playerScore;
      vm.totalConvos = userGameInfo.totalConvos;

      function quit() { //make sure ID is a number and assign it to the data service
        if (userGameInfo.userForwarded) {
          $window.open(userGameInfo.redirectURL(), '_self');
        } else {
          userDataService.userID = "";
          $state.go("GameStart");
        }
      }
    }
  }
})();
