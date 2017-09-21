(function(){
  'use strict';

  angular.module('awkwardAnnie')
  .service('GenralInfoHnadler', GenralInfoHnadler);

//maybe focus on dailug manager 0 it injects things aloooot - 
  /**@ngInject**/
  //for all information used at the end - think of it as constantnly used and updated  information
  function GenralInfoHnadler($log){
    var service ={
      levelCount : 1,       //want to move level count here but has dependencies
      playerScore : 0,// Main controller controls score, what characters were spoken too
      convoCounter : {}, //used in game manager - can we just define it as a varibe there?
      totalConvosAvailable : 18, //used in dailoug manager's directive --
      convoAttemptsTotal : 0 //
    };

    return service;
  }
})();
