(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .directive('initializeGame', initializeGame);

  /** @ngInject */
  function initializeGame($log, $q, $http, $state, $location, userDataService, $stateParams, dialogService, gameConfig, userGameInfo, levelDataHandler) {

    return {
      restrict: 'E',
      controller: controller,
      template: '<div><h1>I am initializing!!!!</h1><div ng-click="clickMe()">Click me!!!</div></div>'
    };

    function controller($scope) {
      var configData;

      var gameType;

      gameConfig.fetchConfig()
        .then(function() {

          gameType = $stateParams.gameType || 'negative';

          if (levelDataHandler.legalLevels.indexOf(gameType) < 0) {
            alert("not a legal level, please type in a legal level");
            return;
          }
          userGameInfo.gameType = gameType;

          var userID = $location.search().userID; //user ID is a qury param -  (--rul > key=value)

          if (userID) {
            userGameInfo.userForwarded = true;
            userGameInfo.userID = userID;
          } else {
            userGameInfo.userForwarded = false;
          }
          levelDataHandler.setUpForGameType(gameType);
          dialogService.loadFromServer(gameType);

          ///TODO - check this with chas fix for slow in chrome - not cpu tho
          localStorage.clear();
          sessionStorage.clear();

          if (userGameInfo.userForwarded) {
            userDataService.resetData();
            userDataService.trackAction(0, "Start", "Game_Start", "Game Start");
            $state.go('instructions');
          } else {
            $state.go('GameStart');
          }
        })



    }

  }

})();
