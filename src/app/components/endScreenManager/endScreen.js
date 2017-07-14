(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('endScreen', endScreen);

    /** @ngInject */
    function endScreen(userDataService, globalGameInfo, $window, levelDataHandler){
      var directive = {
        restrict: "E",
        templateUrl: "app/components/endScreenManager/endScreenTemplate.html",
        scope:{
            main: "="
        },
        controller: controller, //controller for this directive
        controllerAs:'vm',
        bindToController: true
      };
      return directive;

      /** @ngInject */
      function controller($scope, $log, $location) {
        var vm = this;
        vm.quit = quit;
        vm.userID = userDataService.userID;
        vm.playerScore = globalGameInfo.playerScore;
        vm.totalConvos = globalGameInfo.totalConvos;
        
        function quit(){ //make sure ID is a number and assign it to the data service
          if(globalGameInfo.postURL){
            for(var i in globalGameInfo.postURL){
              if(globalGameInfo.postURL.indexOf("%2F")){
                globalGameInfo.postURL = globalGameInfo.postURL.replace("%2F", "/");
              }
              if(globalGameInfo.postURL.indexOf("%3F")){
                globalGameInfo.postURL = globalGameInfo.postURL.replace("%3F", "?");
              }
              if(globalGameInfo.postURL.indexOf("%3D")){
                globalGameInfo.postURL = globalGameInfo.postURL.replace("%3D", "=");
              }
            }
            var postURL_concat = "https://" + globalGameInfo.postURL + "&USERID=" + userDataService.userID;
            $log.log("Rerouting to " + postURL_concat);
            
            $window.open(postURL_concat, '_self');
          }else{
            userDataService.userID = "";
            $location.path("/");
          }
        }
      }
    }
})();