(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('MainController', MainController);


    function MainController(levelDataHandler, userDataService, $log) {

    // function MainController(levelDataHandler, $scope, $location, userDataService, $log, dialogService) {

    var vm = this;
    vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav

    vm.levelUp = false; //not used - returns false regardless ( nothing sets it to true )
    vm.setConversation = setConversation;  //has to do with the current level
    vm.nextLevelData = nextLevelData;
    vm.setRoomData = setRoomData;
    vm.areDialogsCompleted = areDialogsCompleted;
    vm.arrayToString = arrayToString;
    vm.roomKey = "lobby";
    vm.animationTitle = "";
    vm.playerScore = 0; // Main controller controls score, what characters were spoken too
    vm.totalConvoPoints = 0;
    vm.completedConvos = [];
    vm.hideDialog = true; //this is so confusing why are we using it in both here and game manager -- as its own varible
    //not being used in this script --- //used in level manager and current level gui
    vm.numberOfFrames = 0;
    vm.beginingOfLevel2 = false; //commented out in code - not sure if being used //used in one place only and sets it to false ---
    vm.lastConversationSuccessful = false;
    vm.animationDone = true;
    vm.failedConvos  = {}; //used in manager - should it be its own varible? - checks for current level
    vm.convoCounter = {}; //used in game manager - can we just define it as a varibe there?
    vm.totalConvosAvailable = 18; //used in dailoug manager's directive --
    vm.convoAttemptsTotal = 0; //

    //flips dailougs left and right --- something that is current to the level
    vm.flipDialogs = (userDataService.userID==='flip');
    $log.log('player id is "'+userDataService.userID+'" '+vm.flipDialogs);


    //needed for next level
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

    //for current level
    function areDialogsCompleted(possibleConvos, completedConvos){
        for(var i=0; i<possibleConvos.length; i++){
            if(completedConvos.indexOf(possibleConvos[i]) < 0){
                return false;
            }
        }
        return true;
    }

    function arrayToString(array){ //or string.join
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


/*
// function MainController(NextLevelRequirments, CurrentgraphicHandler, GenralInfoHnadler, $log) { //$log parameter goes in here
//   //
//   // var directive = {
//   //   restrict: 'E',
//   //   templateUrl: 'app/components/Main/MainController.html',
//   //   controller: MainGameController,
//   //   scope: {
//   //     main: "=",
//   //     levelCount: "="
//   //   },
//   //   controllerAs: 'vm',
//   //   bindToController: true
//   // };
//   // return directive;

// function MainController(levelDataHandler, userDataService, $log) {
//
// }

// function MainController(levelDataHandler, $scope, $location, userDataService, $log, dialogService) {
/*
var vm = this;
vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav

vm.levelUp = false; //not used - returns false regardless ( nothing sets it to true )


vm.setConversation = setConversation;  //has to do with the current level
vm.nextLevelData = nextLevelData;
vm.setRoomData = setRoomData;
vm.areDialogsCompleted = areDialogsCompleted;
vm.arrayToString = arrayToString;
vm.roomKey = "lobby";
vm.animationTitle = "";
vm.playerScore = 0; // Main controller controls score, what characters were spoken too
vm.totalConvoPoints = 0;
vm.completedConvos = [];
vm.hideDialog = true; //this is so confusing why are we using it in both here and game manager -- as its own varible
//not being used in this script --- //used in level manager and current level gui
vm.numberOfFrames = 0;
vm.beginingOfLevel2 = false; //commented out in code - not sure if being used //used in one place only and sets it to false ---
vm.lastConversationSuccessful = false;
vm.animationDone = true;
vm.failedConvos  = {}; //used in manager - should it be its own varible? - checks for current level
vm.convoCounter = {}; //used in game manager - can we just define it as a varibe there?
vm.totalConvosAvailable = 18; //used in dailoug manager's directive --
vm.convoAttemptsTotal = 0; //

//flips dailougs left and right --- something that is current to the level
vm.flipDialogs = (userDataService.userID==='flip');
$log.log('player id is "'+userDataService.userID+'" '+vm.flipDialogs);


//needed for next level
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

//for current level
function areDialogsCompleted(possibleConvos, completedConvos){
    for(var i=0; i<possibleConvos.length; i++){
        if(completedConvos.indexOf(possibleConvos[i]) < 0){
            return false;
        }
    }
    return true;
}

function arrayToString(array){ //or string.join
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
