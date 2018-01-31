(function(){
  'use strict';

  angular.module('importContent')
  .service('dialogService', dialogContentService);

  /** @ngInject */
  function dialogContentService($log, $http, $q, parseAAContentService){

    var dialogWorksheetKeys = {};

    var service = {
      getDialogs: getDialogs,
      getDialogKeys: getDialogKeys,
      dialogWorksheetKeys: dialogWorksheetKeys,
      loadFromServer: loadFromServer
    };

    var dialogJsonPaths = {


      fran_Linear:"assets/json/FF.Linear.json",
      fran_GR_01:"assets/json/FF.GR.01.json",
      fran_GR_02:"assets/json/FF.GR.02.json",
      fran_ST_01:"assets/json/FF.ST.01.json",
      fran_ST_02:"assets/json/FF.ST.02.json",
      fran_RQ_01:"assets/json/FF.RQ.01.json",
      fran_RQ_02:"assets/json/FF.RQ.02.json",
      luna_STwGR_01: "assets/json/LL.STwGr.01.json",
      luna_STwGR_02: "assets/json/LL.STwGR.02.json",
      mike_Linear:"assets/json/MM.Linear.json",
      mike_GR_01:"assets/json/MM.GR.01.json",
      mike_GR_02:"assets/json/MM.GR.02.json",
      mike_ST_01:"assets/json/MM.ST.01.json",
      mike_ST_02:"assets/json/MM.ST.02.json",
      mike_RQ_01:"assets/json/MM.RQ.01.json",
      mike_RQ_02:"assets/json/MM.RQ.02.json",
      charlie_STwGR_01: "assets/json/CC.STwGr.01.json",
      charlie_ST_02:"assets/json/CC.ST.02.json",
      charlie_RQwGr_02:"assets/json/CC.RQwGr.02.json",
      charlie_RQ_02:"assets/json/CC.RQ.02.json",
      Luna_RQ_01:"assets/json/LL.RQ.01.json",
      Luna_RQ_02:"assets/json/LL.RQ.02.json"

    };
//TODO change this or leave it incase it changes to json?
    for (var dialogKey in dialogJsonPaths) {
      var p = dialogJsonPaths[dialogKey].split('/');
      var jfn = p[p.length-1];
      var worksheetKey = jfn.replace('.json', '');
      dialogWorksheetKeys[dialogKey] = worksheetKey;
}
    var deferred = $q.defer();
    service.deferred = deferred;
    service.loadedPromise = deferred.promise;

    if (deferred ==="undefined"){
      $log.log("!!!UNDEFINED");
    }
    return service;

    function getDialogKeys(){
      return Object.keys(dialogJsonPaths);
    }

    function loadFromServer(gameType) {

      gameType = gameType || "negative";
      var prefix = gameType.split("-")[0];
      $log.log("Loading from url '"+prefix+"' ...");

            return parseAAContentService.parseContentFromGameType(prefix)
                .then(function() {
                    $log.log("Test Loaded from url '"+prefix+"'.");
                    $log.log('Success!');

                })
                .then(function(){
                  $log.log("Take a look at me now!!!");
                  adjustDialogWorksheetKeys();
                  adjustNegativePositiveLinearKeys(gameType);
                  adjustFeedbackAnimations(gameType);
                  service.deferred.resolve();

                })
                .catch(function() {$log.log('Falling back to JSON files');}
                );

        }

        function adjustDialogWorksheetKeys() {

          var casedKeyMap = Object.keys(parseAAContentService.parsedContent)
                    .reduce(function(acc, wsKey) { acc[wsKey.toUpperCase()] = wsKey; return acc;}, {});
          var adjustedKeys = {};
          for (var dialogKey in dialogWorksheetKeys) {
            adjustedKeys[dialogKey] = casedKeyMap[dialogWorksheetKeys[dialogKey].toUpperCase()];
          }
          service.dialogWorksheetKeys = dialogWorksheetKeys = adjustedKeys;

  }
        function adjustNegativePositiveLinearKeys(gameType) {

          var posKeys = "positive";
          var isPositive = gameType.indexOf(posKeys) > -1;
          if(isPositive){
            service.dialogWorksheetKeys['fran_Linear'] = 'FF.Linear.positive';
            service.dialogWorksheetKeys['mike_Linear'] = 'MM.Linear.positive';
          }
          else{
              // $log.log("negative value");
            }

           }

        function adjustFeedbackAnimations(gameType) {

          var ispos = getGameType(gameType);
          function chaseTree (node){
            if(!Array.isArray(node)){
              angular.forEach(node , function(subNode){
                  chaseTree(subNode );
              })
            }
            else{
              angular.forEach(node, function(step){
                if(angular.isUndefined(step.animation)){
                 step.animation = ispos? step.animationPositive: step.animationNegative;
               }
             })
          }
        }
          chaseTree(parseAAContentService.parsedContent);
    }



    function getGameType(gameType){
        var posKeys = "positive";
        var isPositive = gameType.indexOf(posKeys) > -1;
        return isPositive;
        }


    function getDialogs(dialogKey){
      $log.log('getDialogs "'+dialogKey+'"');
      return service.loadedPromise
        .then(function() {
          var spreadsheetContent = parseAAContentService.parsedContent[dialogWorksheetKeys[dialogKey]];
          if (spreadsheetContent) {
            return spreadsheetContent;
          } else {
            $log.warn(':::try raw key "'+dialogKey+'"');
            spreadsheetContent = parseAAContentService.parsedContent[dialogKey];
            if (spreadsheetContent) {
              return spreadsheetContent;
            }
          }
          $log.warn(':::Falling back to JSON file "'+dialogJsonPaths[dialogKey]+'"');

          return $http.get(dialogJsonPaths[dialogKey]).then(function(response){
            return response.data;
          });

        });
        }
  }
})();
