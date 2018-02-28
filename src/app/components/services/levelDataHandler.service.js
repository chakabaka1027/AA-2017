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
      // legalLevels: ['negative', 'negative-set1', 'negative-set4', 'positive', 'positive-set1', 'positive-set3'],
      legalLevels : parseAAContentService.parsedLevelNames,
      maxLevel: 7, //would this be per sheet - above is genral while this is specfic :$
      setUpForGameType: setUpForGameType,
      getRoomDialogs: getRoomDialogs,
      lastlevel: false
    };
    return service;

    function setUpForGameType(gameType) {//TODO!!!new change this into using the new levels structure
      return parseAAContentService.parseContentFromGameType().then(function(response){
        service.legalLevels.push("")
        service.levels = parseAAContentService.getLevelDataForURL().levels;
        });
    }

    function getRoomDialogs(levelKey, roomKey) {

      // console.log("}}}}}}}>>>> testing getRoomDialougs   :",service.levels);

      var currentRoomCheck = service.levels[levelKey].rooms[roomKey];//TODO!!!new check if this changes as well
      var dialogs = [];

      // console.log("}}}}}}}>>>>  currentRoomCheck :",service.levels[levelKey].rooms[roomKey]);// retunrd charlu and luna //what was the key supposed to be here? - AH con

      if (!currentRoomCheck) {
        return dialogs;
      }

      angular.forEach(currentRoomCheck, function(characterData) {// dialogInfo[key]
        if (characterData.dialogInfo[0].key) { //current room is charly and luna no fran...
          dialogs.push(characterData.dialogInfo[0].key);
        }
        if (characterData.dialogInfo.length>1) { //i/e second convo
          dialogs.push(characterData.dialogInfo[1].key);
        }
      });

      return dialogs;

    }
  } //end of controller
})();

//rooms get it right and level key gives right convo im not sure what jeys are or why they are an empty string

// console.log("{{------is thiis ever true ?",dialogs);

//try and acsess the array here //fran ismNecer acconted 4...
// console.log("TT___TT) currentRoomCheck in 4loop ||||||",currentRoomCheck); //characterData holds postion and key... was this the case before? but both empty

// console.log("}}}leangth of array convos a ||||||",characterData.dialogInfo.length); //characterData holds postion and key... was this the case before? but both empty

// console.log("}}}foreachacalled  characterData.dialogInfo ||||||",characterData.dialogInfo ); //characterData holds postion and key... was this the case before? but both empty
// if (characterData.dialogKey) { //current room is charly and luna no fran...
//change 0 to index instead - maybe change to 4loop since need an index or add a var and add checks
// console.log("{{------dialogs on >1 ",dialogs);
// if (characterData.secondConvo && characterData.secondConvo.dialogKey) {
// console.log("{{------dialogs",dialogs);
// dialogs.push(characterData.dialogKey);
//TODO possible fix here


/*** Old Code that was inside set up
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

*/
