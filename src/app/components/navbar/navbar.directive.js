(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('navBar', navBar);

  /** @ngInject */
  function navBar(mainInformationHandler,parseAAContentService) {
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
          //change this ;ater - need a service to use all of these value rather than using the parseAAContentService
          if(parseAAContentService.getLevelDataForURL().display){
            vm.displayScore = true;
          } else {
            vm.displayScore = false;
          }
          vm.playerScore = mainInformationHandler.playerScore;
          vm.levelCount = mainInformationHandler.levelCount;
        })
    }
  }
})();
