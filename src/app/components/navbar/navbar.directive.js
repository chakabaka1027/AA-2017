(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('navBar', navBar);

  /** @ngInject */
  function navBar(mainInformationHandler) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    /** @ngInject */
    function NavbarController($scope) {
      var vm = this;
      
      $scope.$watch(function(){return mainInformationHandler.playerScore+','+mainInformationHandler.levelCount;},
        function() {
          vm.playerScore = mainInformationHandler.playerScore;
          vm.levelCount = mainInformationHandler.levelCount;
        })
    }
  }
})();
