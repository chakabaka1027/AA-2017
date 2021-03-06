(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    //remove url later, before release
    // use different controller for welcome screen
//is this the page that handles url intries? do we need to inject hte location here?
//or add it as a new state? ---

    $stateProvider
      .state('test', {
        url: '/test',
        template: '<chastest></chastest>'
      });
      $stateProvider
        .state('newTest', {
          url: '/newTest',
          template: '<rjtest></rjtest>'
        });

    $stateProvider
      .state('initialization', {
        url: '/{gameType}',
        template: '<initialize-game></initialize-game>'
      });


      $stateProvider
        .state('dialogTestBed', {
          url: '/dialogTestBed/:gameType?',//
          templateUrl: 'app/components/dialogTestBed/dialogTestBed.html',
          controller: 'displayDialogTestBed', //throws away old main and recreates it
          controllerAs: "dialogTest"
        });

    $stateProvider
      .state('tutorial', {
        url: '/tutorial/',
        template: '<simple-tutorial></simple-tutorial>'
      });


    $stateProvider
      .state('GameStart', {
        // url: '/{gameType}',
        template: "<div class='gameContainer'><log-in-manager></log-in-manager></div>"
      });

    $stateProvider
                  //TODO put those in the main ( score / level count --- but service things / model things ---- have a cotnroller but it si a simple controller -- put in a directive )
      .state('instructions', {
        //url: '/instructions',
        template: "<div class='gameContainer'><nav-bar></nav-bar><instruction_page click-sound></instruction_page></div>"
        // controller: 'MainController', //throws away old main and recreates it
        // controllerAs: 'main'
      });
    $stateProvider
      .state('awkwardAnnieGame', {
        // url: '/awkwardAnnieGame',
        // url: '/{gameType}',
        template: '<awkward-annie-game></awkward-annie-game>'
        // controller: 'MainController', //throws away old main and recreates it
        // controllerAs: 'main'
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

      $stateProvider
        .state('templateTest', {
          url: '/templateTest',
          template: '<A></A>'
        });



    $urlRouterProvider.otherwise('/');
  }

})();
