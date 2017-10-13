(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('MainController', MainController);

  /** @ngInject */
  //TODO make this into a service --- overall
  //TODO add a reset - going back to ---
  //would be alomst empty ---
  function MainController(levelDataHandler, $scope, $location, userDataService, $log, dialogService) {
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
    vm.hideDialog = true;
    vm.numberOfFrames = 0;
    vm.beginingOfLevel2 = false;
    vm.lastConversationSuccessful = false;
    vm.animationDone = true;
    vm.failedConvos  = {};
    vm.convoCounter = {};
    vm.totalConvosAvailable = 18;
    vm.convoAttemptsTotal = 0;


    var currentLevel;
    vm.flipDialogs = (userDataService.userID==='flip');
    $log.log('player id is "'+userDataService.userID+'" '+vm.flipDialogs);


    nextLevelData();

    function setConversation(talkingWith){
      vm.talkingWith = talkingWith;
      vm.currentConversation = vm.roomData[talkingWith].dialogKey;
    }

    //TODO move this to datalevel hanler =====
    function nextLevelData(){ //is the problem for single rooms that it increases the counter - but that wasnt an issue before
      var currentLevel = "level_"+vm.levelCount;
      vm.levelConvosNeeded = levelDataHandler.levels[currentLevel].requiredConversations;
      vm.roomData = levelDataHandler.levels[currentLevel].rooms[vm.roomKey];
    }

    function setRoomData(roomKey){
        var currentLevel = "level_"+vm.levelCount;
        vm.roomData = levelDataHandler.levels[currentLevel].rooms[roomKey];
    }

    function areDialogsCompleted(possibleConvos, completedConvos){
        for(var i=0; i<possibleConvos.length; i++){
            if(completedConvos.indexOf(possibleConvos[i]) < 0){
                return false;
            }
        }
        return true;
    }

//TODO must die
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
