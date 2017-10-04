(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .service('IntroService', IntroService);


  /** @ngInject */
  function IntroService($log, $stateParams, $http, $location, $q ) {
    var LocalGt ;
    var service = {
      dataTest:{},
      loadTutorialData:loadTutorialData,
      t2:t2
       };
       console.log("hello world 1");


       return service;

       var localgameType; //just for testing



      function loadTutorialData(gameType) {
        var positivePath = "assets/tutorialJson/positiveIntro.json";
        var negativePath = "assets/tutorialJson/negativeIntro.json";
        var path;

        var promise = $q.defer();

        if (gameType.indexOf("positive") === 0) {
          path = positivePath;
        }
        else {
          path = negativePath;
        }

            // return $http.get(path).then(function(response){
             $http.get(path).then(function(response){
               var data = response.data;
               service.test = data;
               promise.resolve(data);
              //  IntroService.deferred.resolve();
               $log.log(service.test); //works here but not global since its async - need to reslolve?
          }).catch(function(){
            $log.log("error - cannot read file");
          });
          $log.log("can not resolve it- async data god - undefined outside of promise "+service.tes);


        }//end of method



      }
      function t2(){
        console.log("><><"+service.test);

      }
    })();
