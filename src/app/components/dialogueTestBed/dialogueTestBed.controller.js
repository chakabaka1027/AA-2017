(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('displayDialougeTestBed', displayDialougeTestBed);

  /** @ngInject */
  function displayDialougeTestBed($log, $scope, $timeout, dialogueService) {
    var vm = this;
    vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav
    vm.levelUp = false;
    vm.currentConversation = "fran_Linear";
    vm.failedConvos= [];
    vm.dialogList = dialogueService.getDialogKeys();
    vm.talkingWith = "fran";
    vm.displayCharacters = true;

    $scope.$watch(function(){ return vm.currentConversation;},   
      function(newVal, oldVal){
        vm.branchHistory = []; 
        $log.log(newVal, oldVal);
        vm.talkingWith = vm.currentConversation.split("_")[0];
        vm.displayCharacters = false;
        $timeout(function(){vm.displayCharacters = true}, 0);
      }
    );
  }   

})();