(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .service('tutorialService', tutorialService);


  /** @ngInject */
  function tutorialService($log, $stateParams, $http, $location, $q, userGameInfo) {
    var service = {
      loadTutorialData: loadTutorialData
    };
    return service;

    function loadTutorialData() {
      var positivePath = "assets/tutorialJson/positiveIntro.json";
      var negativePath = "assets/tutorialJson/negativeIntro.json";
      var path;

      if (userGameInfo.isGamePositive()) {
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
