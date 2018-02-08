(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('logInManager', logInManager)

  /** @ngInject */
  function logInManager($location, userDataService) { //userGameInfo

    var directive = {
      restrict: 'AE',
      controller: introController,
      templateUrl: "app/components/logIn_Manager/introSpecs.html",
      scope: {
        main: "="
      },
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
    /** @ngInject */
    function introController($timeout, $location, $state) {
      var vm = this;
      vm.submitID = submitID;

      function submitID() { //make sure ID is a number and assign it to the data service
        userDataService.userID = vm.playerID;
        userDataService.resetData();
        userDataService.trackAction(0, "Start", "Game_Start", "Game Start");

        $state.go("instructions");

        //$location.path("/instructions").search({USERID: vm.playerID});
      }


    } //end of controller
  }
})();
