(function(){
  'use strict';

  angular.module('awkwardAnnie')
  .service('CurrentMediaandler', CurrentgraphicHandler);


  /**@ngInject**/
  //anything that has to do with animation / hiding ext / frames or astetic / dialoug text itself ...etc
  function CurrentgraphicHandler(userDataService, $log){
    var service ={

      animationTitle : "",
      hideDialog : true, //this is so confusing why are we using it in both here and game manager -- as its own varible
      numberOfFrames : 0, //just returns 0 not sure if it being used
      animationDone : true,
      flipDialogs : flipDialogs,
      arrayToString : arrayToString //has to do with current convo

    };

    return service;


    function flipDialogs(){
      return (userDataService.userID==='flip');
    }


    function arrayToString(array){ //or arr.join
        var stringConcat = "";
        for(var index in array){
            stringConcat += array[index];
            if(array.length >= 1 && array.length-1 != index){ //but cond
              stringConcat += " ";
            }
        }
        return stringConcat;

      //  array.join(" ");
    }

  }
})();
