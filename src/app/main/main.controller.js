(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('x', MainController);

  /** @ngInject */
  //TODO make this into a service --- overall
  //TODO add a reset - going back to ---
  //would be alomst empty ---
  function MainController(levelDataHandler, $scope, $location, userDataService, $log) {
    var vm = this;
    vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav
    vm.levelUp = false;
    vm.setConversation = setConversation;
    vm.nextLevelData = nextLevelData;
    vm.setRoomData = setRoomData;
    vm.areDialogsCompleted = areDialogsCompleted;
    // vm.arrayToString = arrayToString;
    vm.roomKey = "lobby";
    vm.animationTitle = "";
    vm.playerScore = 0; // Main controller controls score, what characters were spoken too
    vm.totalConvoPoints = 0;
    vm.completedConvos = [];
    vm.hideDialog = true;
    // vm.numberOfFrames = 0;
    // vm.beginingOfLevel2 = false;
    vm.lastConversationSuccessful = false;
    vm.animationDone = true;
    vm.failedConvos  = {};
    vm.convoCounter = {};
    vm.totalConvosAvailable = 18;
    vm.convoAttemptsTotal = 0;
    vm.levelConvosNeeded=0;//new

    vm.flipDialogs = (userDataService.userID==='flip');
    $log.log('player id is "'+userDataService.userID+'" '+vm.flipDialogs);


    nextLevelData();

    function setConversation(talkingWith){
      vm.talkingWith = talkingWith;
      vm.currentConversation = vm.roomData[talkingWith].dialogKey;
      console.log(",,,,currentConversation is "+typeof(vm.currentConversation));

    }

    //TODO move this to datalevel hanler =====
    function nextLevelData(){ //is the problem for single rooms that it increases the counter - but that wasnt an issue before
      var currentLevel = "level_"+vm.levelCount;
      vm.levelConvosNeeded = levelDataHandler.levels[currentLevel].requiredConversations;
      vm.roomData = levelDataHandler.levels[currentLevel].rooms[vm.roomKey];
      console.log(",,,,levelConvosNeeded is "+typeof(vm.levelConvosNeeded));

    }

    function setRoomData(roomKey){
        var currentLevel = "level_"+vm.levelCount;
        vm.roomData = levelDataHandler.levels[currentLevel].rooms[roomKey];
        console.log(",,,,,room data is "+typeof(vm.roomData));
    }

    function areDialogsCompleted(possibleConvos){//, completedConvos
        for(var i=0; i<possibleConvos.length; i++){
            if(vm.completedConvos.indexOf(possibleConvos[i]) < 0){
                return false;
            }
        }
        return true;
    }



    // function areDialogsCompleted(possibleConvos, completedConvos){
    //     for(var i=0; i<possibleConvos.length; i++){
    //         if(completedConvos.indexOf(possibleConvos[i]) < 0){//is this the array ot the service
    //             return false;
    //         }
    //     }
    //     return true;
    // }
//TODO

//works ok without check - verify with chas
  //   function arrayToString(array){
  //
  //       var stringConcat = "";
  //       for(var index in array){
  //           stringConcat += array[index];
  //           if(array.length >= 1 && array.length-1 != index){
  //             stringConcat += " ";
  //           }
  //       }
  //       return stringConcat;
  //   }
  }
})();
