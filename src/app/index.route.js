(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    //remove url later, before release
    // use different controller for welcome screen
    $stateProvider
      .state('GameStart', {
        url: '/:gameType?',
        template: "<div class='gameContainer'><log-in-manager></log-in-manager></div>"
      });
      $stateProvider
      .state('instructions', {
        //url: '/instructions',
        template: "<div class='gameContainer'><nav-bar player-score='main.playerScore' level-count='main.levelCount'></nav-bar><instruction_page></instruction_page></div>",
         controller: 'MainController', //throws away old main and recreates it
        controllerAs: 'main'
      });
    $stateProvider
      .state('awkwardAnnieGame', {
        //url: '/awkwardAnnieGame',
        templateUrl: 'app/components/gameManager/AnnieGameContainer/awkwardAnnieGame.html',
        controller: 'MainController', //throws away old main and recreates it
        controllerAs: 'main'
      });

      $stateProvider
      .state('dialogTestBed', {
        url: '/dialogTestBed/:gameType?',
        templateUrl: 'app/components/dialogTestBed/dialogTestBed.html',
        controller: 'displayDialogTestBed', //throws away old main and recreates it
        controllerAs: "dialogTest"
      });

      $stateProvider
      .state('landingPage', {
        url: '/landingPage',
        templateUrl: 'app/components/landingPage/landingPage.html'
      });

    $stateProvider
      .state('endScreen', {
        //url: '/endScreen',
        templateUrl: 'app/components/endScreenManager/endScreen.html'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
