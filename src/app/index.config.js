(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .config(config); //not a router

  /** @ngInject */
  function config($logProvider, $locationProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
    //$locationProvider.html5Mode(true);
  }
})();
