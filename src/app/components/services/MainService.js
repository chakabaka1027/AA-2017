(function(){
  'use strict';

  angular.module('importContent')
  .service('MainInformationHandler', MainInformationHandler);

  /** @ngInject */
  function MainInformationHandler(){

    var service ={
      levelCount:1,
      playerScore:0,
      levelUp:false,
      lastConversationSuccessful:false,
      roomKey: "lobby",
      animationTitle:"",
      animationDone :true,
      hideDialog:true,
      totalConvoPoints:0,
      completedConvos:[],
      failedConvos  :{},
      convoCounter : {},
      totalConvosAvailable :18,
      convoAttemptsTotal ; 0,
      setConversation:setConversation,
      nextLevelData:nextLevelData,
      setRoomData:setRoomData,
      areDialogsCompleted:areDialogsCompleted,
    }


return service;




}//end of controller





















  })();
