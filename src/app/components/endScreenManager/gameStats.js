(function(){
  'use strict';

  angular
  .module('awkwardAnnie')
  .service('globalGameInfo', globalGameInfo);

  /** @ngInject */
  function globalGameInfo(){
    var service = {
    playerScore: 0,
    totalConvos: 0,
    postURL: ""
    };
    return service;
  }
})();