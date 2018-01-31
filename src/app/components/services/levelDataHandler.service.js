(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .service('levelDataHandler', levelDataHandler);


  /** @ngInject */
  function levelDataHandler($log, $stateParams, $http, parseAAContentService, $q) {
    var service = {
      choiceScores: {
        A: 0,
        B: 3,
        C: 5
      },
      successPaths: ["ACC", "CAC", "CCA", "BBC", "BCB", "CBB", "BCC", "CBC", "CCB", "CCC","CCCC"], //QUICK FIX FOR LINER
      legalLevels: ['negative', 'negative-set1', 'negative-set4', 'positive', 'positive-set1', 'positive-set3'],
      maxLevel: 7,
      setUpForGameType: setUpForGameType,
      getRoomDialogs: getRoomDialogs,
      lastlevel: false
    };

    return service;

    function setUpForGameType(gameType) {//TODO!!!new change this into using the new levels structure
      var levelsPath = "assets/LevelJson/levels.json";
      var otherLevelsPath = "assets/LevelJson/otherlevels.json";
      // service.templateSampleForTestingOnly


      // var p = $q.defer();
      // // if(parseAAContentService.levelDataInformation.template2.levelData!= undefined){
      // if(!angular.equals( parseAAContentService.templateSampleForTestingOnly, {})){ //is not empty
      //   p.resolve(parseAAContentService.levelDataInformation.template2.levelData);
      // } else {
      //   p.reject("undefined still")
      //   console.warn("promise failed to resolve");
      // }
      // p.then(function(response){
      //   service.testingNewLevels = response;
      //   console.log(">>>> new levelstesting promise  :",response);
      //   console.log("<<<<testing", )
      // });
      // return q.promise;

//////////////////////////////////
    return parseAAContentService.parseContentFromGameType().then(function(response){
        // console.log(">>>>>>> : parseAAContentService.levelDataInformation  inside set up :",
        //  parseAAContentService.templateSampleForTestingOnly); // i get why its happning - async but tried using other method temp since it is in the patser as well
         // service.testingNewLevels = parseAAContentService.templateSampleForTestingOnly;
         service.levels = parseAAContentService.templateSampleForTestingOnly;

         console.log(">>>> new levels inside  :",service.levels);
      });


      //
      // // console.log(">>>> new levels OUTSIDE:",service.testingNewLevels);
      //
      // // console.log(">>>>>>> : parseAAContentService.levelDataInformation  inside set up :",
      // //  parseAAContentService.templateSampleForTestingOnly); //value belo wwas just evaluated now - not an error but what shows up --  this evaluates before parser - ODD
      //
      // if (gameType.indexOf("positive") === 0) {
      //   service.successPaths = ["CAA", "ACA", "AAC", "BBA", "BAB", "ABB", "BAA", "ABA", "AAB", "AAA"];
      //   service.choiceScores = {
      //     A: 5,
      //     B: 3,
      //     C: 0
      //   };
      // }
      //
      // if (gameType === "negative" || gameType === "positive") {
      //   return $http.get(levelsPath).then(function(response) {
      //     // parseAAContentService.levelDataInformation
      //     service.levels = response.data; //TODO!!!new change this into using the new levels structure
      //   // console.log("||||||| : parseAAContentService.levelDataInformation :", parseAAContentService.levelDataInformation.template2);
      //     // console.log("^^^ : service.levelsn :" , service.levels);
      //
      //     //set up for main levels trmplate
      //   })
      // } else {
      //   // console.log("^^^ : parseAAContentService.levelDataInformation :", parseAAContentService.levelDataInformation);
      //
      //   service.maxLevel = 1;
      //   return $http.get(otherLevelsPath).then(function(response) { //TODO!!!new change this into using the new levels structure
      //     //set up for other levels template
      //     service.levels = response.data[gameType];
      //     //service.levels.level_1 - to acsess data
      //   });
      // }
    } //end of setUp


    function getRoomDialogs(levelKey, roomKey) {
      console.log("}}}}}}}>>>> testing outside   :",service.levels);

        var currentRoomCheck = service.levels[levelKey].rooms[roomKey];//TODO!!!new check if this changes as well
        var dialogs = [];
        if (!currentRoomCheck)
        {
          return dialogs;
        }

        angular.forEach(currentRoomCheck, function(characterData) {
          if (characterData.dialogKey) {
            dialogs.push(characterData.dialogKey);
          }
          if (characterData.secondConvo && characterData.secondConvo.dialogKey) {
            dialogs.push(characterData.secondConvo.dialogKey);
          }
        });
        return dialogs;
    }
  } //end of controller
})();
