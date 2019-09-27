(function(){
  'use strict';

  angular
  .module('awkwardAnnie')
  .service('userGameInfo', userGameInfo);
  var postURL ="http://researchtech1.ets.org/C3.Net/launch/GameComplete.aspx"; //TODO THIS IS never used move it to anotherscope ? - as a defaul

  /** @ngInject */
  function userGameInfo(gameConfig, $location){
    var service = {
      playerScore: 0,
      totalConvos: 0,
      postURL: "",
      userForwarded: false,

      redirectURL:redirectURL,
      isGamePositive: isGamePositive
    };
    return service;

    function redirectURL(){

      return gameConfig.postURL;
      //returns a url string
    }

    function isGamePositive() {
      return $location.path().toLowerCase().indexOf('positive')>=0;
    }
  }

})();
