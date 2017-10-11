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

      //FULL GAME POS AND NEG
      //dealing with a rpomice - intilization needs to say wait intull promice has been resolved - how httlp works a little bit
      setUpForGameType: setUpForGameType,
      getRoomDialogs: getRoomDialogs
    };

    return service;
    function setUpForGameType(gameType) { //adding return genearates a promise and then we say .then it also genrates a promise - maybe in initlization code - maybe ( not for this one) - go get these configuration files then there are some decg i need to make

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
          service.levels = response.data; //parsed
        })
      } else {
        service.maxLevel = 1;
        return $http.get(otherLevelsPath).then(function(response) {
          service.levels = response.data[gameType];
          //service.levels.level_1 - to acsess
        });
      }
    } //end of setUp


    //Is there any dialog in this room, if yes, what are they.
    //Later on check if they've been completed
    function getRoomDialogs(levelKey, roomKey) { //example level 1. rooms
      var currentRoomCheck = service.levels[levelKey].rooms[roomKey];
      var dialogs = [];
      if (!currentRoomCheck) // not{
      {
        return dialogs;
      }

      angular.forEach(currentRoomCheck, function(characterData, characterName) {
        if (characterData.dialogKey) {
          dialogs.push(characterData.dialogKey);
        }
        //second convo - come back  if we chaneg this later
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
