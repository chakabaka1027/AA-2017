(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .config(config); //not a router

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }
})();
