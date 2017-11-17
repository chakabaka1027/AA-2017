(function(){
  'use strict';

  angular
  .module('awkwardAnnie')
  .service('userGameInfo', userGameInfo);
  var postURL ="http://researchtech1.ets.org/C3.Net/launch/GameComplete.aspx"; //TODO THIS IS never used move it to anotherscope ? - as a defaul

  /** @ngInject */
  function userGameInfo(gameConfig){
    var service = {
    playerScore: 0,
    totalConvos: 0,
    postURL: "",
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
