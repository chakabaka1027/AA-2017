(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('displayDialougeTestBed', displayDialougeTestBed);

  /** @ngInject */
  function displayDialougeTestBed($log, $scope, $timeout, dialogueService, parseAAContentService, conversationP5Data) {
    var vm = this;
    vm.currentConversation = "fran_Linear";
    vm.talkingWith = "fran";
    vm.hasLoaded = false;
    vm.loadFromFile = loadFromFile;
    vm.currentSource = "Website"
    vm.animationValid = true;

    dialogueService.loadedPromise.then(activate);

    function activate(){
      $log.log("loaded dialog data")
      vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav
      vm.levelUp = false;
      vm.failedConvos= [];
      vm.dialogList = dialogueService.getDialogKeys()
                        .map(function(dkey) {
                          return {
                            label: dkey+' ['+dialogueService.dialogWorksheetKeys[dkey]+']',
                            key: dkey
                          };
                        });
      $log.log(vm.dialogList);
      vm.displayCharacters = true;
      vm.hasLoaded = true;

      $scope.$watch(function(){ return vm.currentConversation;},   
        function(newVal, oldVal){
          $log.log('select: ', vm.currentConversation);
          vm.branchHistory = []; 
          $log.log(newVal, oldVal);
          vm.talkingWith = vm.currentConversation.split("_")[0];
          vm.displayCharacters = false;
          $timeout(function(){vm.displayCharacters = true}, 0);
        }
      );

      $scope.$watch(function(){return vm.talkingWith+':'+vm.animationTitle;}, function() {
        if (!vm.animationTitle) {
          vm.animationValid = true;
        } else {
          vm.animationValid = conversationP5Data[vm.talkingWith].animations[vm.animationTitle];
        }
      });


    }

    function loadFromFile(fileObject) {

      if(fileObject.name.indexOf(".xlsx") < 0){
        alert("Not an Excel File!")
        return;
      }

      vm.hasLoaded = false;

      vm.status = "Loading from file '"+fileObject.name+"' ...";
      vm.currentSource = fileObject.name+' (local)';

      parseAAContentService.parseContentFromFile(fileObject)
          .then(function(parsedContent) {
              vm.status = "Loaded from file '"+fileObject.name+"'.";
              $log.log('Success!');
              $log.log(parsedContent);
              vm.lastFileObject = fileObject;
              vm.hasLoaded = true;
      });
    }

    
  }   

})();