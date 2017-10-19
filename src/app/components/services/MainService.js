(function(){
  'use strict';

  angular.module('awkwardAnnie')
  .service('MainInformationHandler', MainInformationHandler);

  /** @ngInject */
  function MainInformationHandler( levelDataHandler, $log ){

    var service ={
      levelCount:1,
      playerScore:0,
      lastConversationSuccessful:false,
      roomKey: "lobby",
      animationTitle:"",
      animationDone :true,
      hideDialog:true,
      talkingWith:"",
      totalConvoPoints:0,
      completedConvos:[],
      failedConvos  :{},
      convoCounter : {},
      totalConvosAvailable :18,
      convoAttemptsTotal : 0,
      // setConversation:setConversation,
      nextLevelData:nextLevelData,
      setRoomData:setRoomData,
      areDialogsCompleted:areDialogsCompleted,
      levelConvosNeeded:0
    };


    service.nextLevelData();


return service;


// function setConversation(talkingWith){
//   service.talkingWith = talkingWith;
//   service.currentConversation = service.roomData[talkingWith].dialogKey;
// }

//TODO move this to datalevel hanler =====
function nextLevelData(){ //is the problem for single rooms that it increases the counter - but that wasnt an issue before
  var currentLevel = "level_"+service.levelCount;
  service.levelConvosNeeded = levelDataHandler.levels[currentLevel].requiredConversations;
  service.roomData = levelDataHandler.levels[currentLevel].rooms[MainInformationHandler.roomKey];
}//  vm.roomData

function setRoomData(roomKey){
    var currentLevel = "level_"+service.levelCount;
    service.roomData = levelDataHandler.levels[currentLevel].rooms[roomKey];
}

function areDialogsCompleted(possibleConvos){//, completedConvos
    for(var i=0; i<possibleConvos.length; i++){
        if(service.completedConvos.indexOf(possibleConvos[i]) < 0){
            return false;
        }
    }
    return true;
}

    }//end of controller
})();