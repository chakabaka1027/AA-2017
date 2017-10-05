(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .service('IntroService', IntroService);


  /** @ngInject */
  function IntroService($log, $stateParams, $http, $location, $q ,userGameInfo ) {
    var LocalGt ;
    var service = {
      dataTest:{},
      loadTutorialData:loadTutorialData,

       };


       return service;

       var localgameType; //just for testing



      function loadTutorialData(gameType) {
        var positivePath = "assets/tutorialJson/positiveIntro.json";
        var negativePath = "assets/tutorialJson/negativeIntro.json";
        var path;

        var defered = $q.defer();
        //promise has a property called promise and i want to return promise. promise
        //the promise is diff than differed
        // var defered  = $q.defer();  -
        //return prmise.promise - dont call it promise
        //then-able
        if (userGameInfo.gameType.indexOf("positive") === 0) {
          path = positivePath;
        }
        else {
          path = negativePath;
        }
// loadTutorialData.gametype'sstring value .then ---- my function
            // return $http.get(path).then(function(response){
             $http.get(path).then(function(response){
               var data = response.data;
               service.data = data;
               defered.resolve(data);

              //  IntroService.deferred.resolve();
               $log.log(service.test); //works here but not global since its async - need to reslolve?
          }).catch(function(){
            $log.log("error - cannot read file");
          });
          $log.log("can not resolve it- async data god - undefined outside of promise "+service.tes);

          return defered.promise;
        }//end of method



      }

    })();
