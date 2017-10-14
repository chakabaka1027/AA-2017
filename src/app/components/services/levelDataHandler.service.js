(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .service('levelDataHandler', levelDataHandler);


  /** @ngInject */
  function levelDataHandler($log, $stateParams, $http) {
    var service = {
      choiceScores: {
        A: 0,
        B: 3,
        C: 5
      },
      successPaths: ["ACC", "CAC", "CCA", "BBC", "BCB", "CBB", "BCC", "CBC", "CCB", "CCC"],
      legalLevels: ['negative', 'negative-set1', 'negative-set4', 'positive', 'positive-set1', 'positive-set3'],
      maxLevel: 7,
      setUpForGameType: setUpForGameType,
      getRoomDialogs: getRoomDialogs,
      lastlevel: false
    };

    return service;
    function setUpForGameType(gameType) {
      var levelsPath = "assets/LevelJson/levels.json";
      var otherLevelsPath = "assets/LevelJson/otherlevels.json";
      if (gameType.indexOf("positive") === 0) {
        service.successPaths = ["CAA", "ACA", "AAC", "BBA", "BAB", "ABB", "BAA", "ABA", "AAB", "AAA"];
        service.choiceScores = {
          A: 5,
          B: 3,
          C: 0
        };
      }

      if (gameType === "negative" || gameType === "positive") {
        return $http.get(levelsPath).then(function(response) {
          service.levels = response.data;
        })
      } else {
        service.maxLevel = 1;
        return $http.get(otherLevelsPath).then(function(response) {
          service.levels = response.data[gameType];
          //service.levels.level_1 - to acsess data
        });
      }
    } //end of setUp


    function getRoomDialogs(levelKey, roomKey) {
        var currentRoomCheck = service.levels[levelKey].rooms[roomKey];
        var dialogs = [];
        if (!currentRoomCheck)
        {
          return dialogs;
        }

        angular.forEach(currentRoomCheck, function(characterData, characterName) {
          if (characterData.dialogKey) {
            dialogs.push(characterData.dialogKey);
          }
          if (characterData.secondConvo && characterData.secondConvo.dialogKey) {
            dialogs.push(characterData.secondConvo.dialogKey);
          }
        });
        return dialogs;
    }

    function getSuccessPaths(dialogKey) {
      $log.error("are you sure you wanna be using this - should not return paths ");
      for (var levelKey in service) {
        if (levelKey.indexOf('level_') === 0) {
          var levelInfo = service[levelKey];
          for (var roomKey in levelInfo.rooms) {
            var roomInfo = levelInfo.rooms[roomKey];
            for (var charKey in roomInfo.characters) {
              var charInfo = roomInfo.characters[charKey];
              if (charInfo.dialogKey === dialogKey) {
                return charInfo.successPaths;
              }
              if (charInfo.secondConvo && charInfo.secondConvo.dialogKey === dialogKey) {
                return charInfo.secondConvo.successPaths;
              }

            }
          }
        }
      }
      // not found!
      return [];
    }
  } //end of controller
})();
