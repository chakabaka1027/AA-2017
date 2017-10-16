(function(){
  'use strict';

  angular
  .module('awkwardAnnie')
  .service('userGameInfo', userGameInfo);
  var postURL ="http://researchtech1.ets.org/C3.Net/launch/GameComplete.aspx";

  /** @ngInject */
  function userGameInfo(gameConfig){
    var service = {
    playerScore: 0,
    totalConvos: 0,
    postURL: "", //TODO is this used anywhere
    redirectURL:redirectURL,
    userForwarded: false
    };
    return service;

    function redirectURL(){

      return gameConfig.postURL;
      //returns a url string
    }
  }

})();
