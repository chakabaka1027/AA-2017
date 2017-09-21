(function(){
  'use strict';

  angular.module('awkwardAnnie')
  .service('NextLevelRequirments', NextLevelRequirments);

//or current Info - not sure what to call this or if it should be seprated further?
  /**@ngInject**/
  //data that needed to ptogress into next level 0r counting for cirrent level ---
  function NextLevelRequirments(levelDataHandler, $log, GenralInfoHnadler){
    var service ={      //not sure how you would prefer this - anything used by a current level or anythig needed by a current level to progress?
                        //used in actual level
      roomKey : "lobby",     //counted to pass into next cond / level
      totalConvoPoints : 0,
      beginingOfLevel2 : false,
      nextLevelData : nextLevelData,
      setRoomData : setRoomData,
      areDialogsCompleted : areDialogsCompleted, //needed to progress to next level
      failedConvos  : {}, //used in manager - should it be its own varible? - checks for current level
      setConversation : setConversation,
      lastConversationSuccessful : false, //current level effect
      completedConvos :[]
    };

    return service;

//needed for next methods
    function nextLevelData(){
      var currentLevel = "level_"+ GenralInfoHnadler.levelCount;
      levelConvosNeeded = levelDataHandler[currentLevel].requiredConversations;
      roomData = levelDataHandler[currentLevel].rooms[roomKey];
    }

//current  - for this level and checks for nexts methods
    function setRoomData(roomKey){
        var currentLevel = "level_"+ GenralInfoHnadler.levelCount;
        roomData = levelDataHandler[currentLevel].rooms[roomKey];
    }
    //somthing is wrong with this  yo'
      function setConversation(talkingWith){
        vm.talkingWith = talkingWith;
        vm.currentConversation = vm.roomData.characters[talkingWith].dialogKey;
      }

    function areDialogsCompleted(possibleConvos, completedConvos){
        for(var i=0; i<possibleConvos.length; i++){
            if(completedConvos.indexOf(possibleConvos[i]) < 0){
                return false;
            }
        }
        return true;
    }

})();
