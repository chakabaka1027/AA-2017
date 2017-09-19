(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('navBar', navBar);

  /** @ngInject */
  function navBar($log) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        main: '=',
        playerScore: "=",
        levelCount: "="
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    /** @ngInject */
    function NavbarController($scope) {
      var vm = this;
    }
  }
})();
