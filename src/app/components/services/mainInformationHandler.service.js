(function(){
  'use strict';

  angular.module('awkwardAnnie')
  .service('mainInformationHandler', mainInformationHandler);

  /** @ngInject */
  function mainInformationHandler($log, levelDataHandler, dialogOptions, roomData){

    var service ={
      nextLevelData:nextLevelData,
      setRoomData:setRoomData,
      areDialogsCompleted:areDialogsCompleted,
      reset: reset
    };

    reset();

    return service;

    function reset() {
      angular.extend(service, {
          levelCount:1,
          playerScore:0,
          lastConversationSuccessful:false,
          // roomKey: "lobby",
          roomKey: "room4",
          totalConvoPoints:0,
          completedConvos:[],
          failedConvos  :{},
          convoCounter : {},
          levelConvosNeeded:{},
          currentConversation:"",
          totalConvosAvailable :18,
          convoAttemptsTotal : 0,
          roomData:{}
      });
    }

    //TODO move this to datalevel hanler =====
    function nextLevelData(){ //is the problem for single rooms that it increases the counter - but that wasnt an issue before
      $log.log('mainInfoHandler.nextLevelData');
      setRoomData(service.roomKey);
    }//  vm.roomData

    function setRoomData(roomKey){
        $log.log('mainInfoHandler.setRoomData');
        var currentLevel = "level_"+service.levelCount;
        service.levelConvosNeeded = levelDataHandler.levels[currentLevel].requiredConversations;
        service.roomData = levelDataHandler.levels[currentLevel].rooms[roomData.roomNameMapping[roomKey]]; ////TODO !!! NEW CHANGE HERE

        $log.log('roomKey '+roomKey);
        $log.log(levelDataHandler.levels[currentLevel].rooms);
        $log.log(service.roomData);
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
