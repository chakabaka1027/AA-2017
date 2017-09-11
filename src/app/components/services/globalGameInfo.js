(function(){
  'use strict';

  angular
  .module('awkwardAnnie')
  .service('globalGameInfo', globalGameInfo);
  var postURL ="http://researchtech1.ets.org/C3.Net/launch/GameComplete.aspx";
  //paste the url here ---
  //same as static const
  /** @ngInject */
  function globalGameInfo(){
    var service = {
    playerScore: 0,
    totalConvos: 0,
    postURL: "",
    redirectURL:redirectURL,
    userForwarded: false
    };
    return service;

    function redirectURL(){

      return postURL;
      //returns a url string
    }

  }



  // if(globalGameInfo.postURL){ //move this into game info controller
  //   for(var i in globalGameInfo.postURL){//if global game info . user was forwarded then
  //     if(globalGameInfo.postURL.indexOf("%2F")){//add window .navigation here
  //       globalGameInfo.postURL = globalGameInfo.postURL.replace("%2F", "/");
  //     }
  //     if(globalGameInfo.postURL.indexOf("%3F")){
  //       globalGameInfo.postURL = globalGameInfo.postURL.replace("%3F", "?");
  //     }
  //     if(globalGameInfo.postURL.indexOf("%3D")){
  //       globalGameInfo.postURL = globalGameInfo.postURL.replace("%3D", "=");
  //     }
  //   }
  //   var postURL_concat = "https://" + globalGameInfo.postURL + "&USERID=" + userDataService.userID;
  //   $log.log("Rerouting to " + postURL_concat);



  //
})();
