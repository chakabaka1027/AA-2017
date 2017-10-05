(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .service('TutorialService', TutorialService);


  /** @ngInject */
  function TutorialService($log, $stateParams, $http, $location, $q, userGameInfo) {
    var LocalGt;
    var service = {
      loadTutorialData: loadTutorialData,
    };


    return service;

    function loadTutorialData(gameType) {
      var positivePath = "assets/tutorialJson/positiveIntro.json";
      var negativePath = "assets/tutorialJson/negativeIntro.json";
      var path;


      if (userGameInfo.gameType.indexOf("positive") === 0) {
        path = positivePath;
      } else {
        path = negativePath;
      }

      return $http.get(path).then(function(response) {
        var data = response.data;
        service.data = data;
      }).catch(function() {
        $log.log("error - cannot read file");
      });

    } //end of method

  }

})();
