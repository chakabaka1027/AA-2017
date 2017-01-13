(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('MainController', MainController);
    // In the future this should be a service insead of the main controller. Wouldn't need other files if this change happened, but I didn't have time to refactor this project. 

  /** @ngInject */
  function MainController(levelDataHandler, $scope, $location, userDataService, $log) {
    var vm = this;
    vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav
    vm.levelUp = false;
    vm.setConversation = setConversation;
    vm.nextLevelData = nextLevelData;
    vm.setRoomData = setRoomData;
    vm.areDialogsCompleted = areDialogsCompleted;
    vm.arrayToString = arrayToString;
    vm.roomKey = "lobby";
    vm.animationTitle = "";
    vm.playerScore = 0; // Main controller controls score, what characters were spoken too
    vm.totalConvoPoints = 0;
    vm.completedConvos = [];
    vm.hideDialogue = true;
    vm.numberOfFrames = 0;
    vm.beginingOfLevel2 = false;
    vm.lastConversationSuccessful = false;
    vm.animationDone = true;
    vm.failedConvos  = {};
    vm.convoCounter = {};
    vm.totalConvosAvailable = 18;
    vm.convoAttemptsTotal = 0;

    nextLevelData();
    
    function setConversation(talkingWith){
      vm.talkingWith = talkingWith;
      vm.currentConversation = vm.roomData.characters[talkingWith].dialogKey;
    }

    function nextLevelData(){
      var currentLevel = "level_"+vm.levelCount;
      vm.levelConvosNeeded = levelDataHandler[currentLevel].requiredConversations;
      vm.roomData = levelDataHandler[currentLevel].rooms[vm.roomKey];
    }

    function setRoomData(roomKey){
        var currentLevel = "level_"+vm.levelCount;
        vm.roomData = levelDataHandler[currentLevel].rooms[roomKey];
    }
    /*//ETS requested transition if(vm.main.levelCount === 0){ vm.main.levelCount += 1; }else if(vm.main.levelCount === 1){ vm.main.levelCount += 1; vm.main.setRoomLevelData("conferenceRoom");}*/

    //checks the array of completed dialog names and compares it to the possible convos
    function areDialogsCompleted(possibleConvos, completedConvos){
        for(var i=0; i<possibleConvos.length; i++){
            if(completedConvos.indexOf(possibleConvos[i]) < 0){
                return false;
            }
        }
        return true; //if all possible convos are in the completedConvos array, return true
    } //can use it to check room dialogs as well as level needed dialogs

    function arrayToString(array){
        var stringConcat = "";
        for(var index in array){
            stringConcat += array[index];
            if(array.length >= 1 && array.length-1 != index){
              stringConcat += " ";
            }
        }
        return stringConcat;
    }
  }
})();
