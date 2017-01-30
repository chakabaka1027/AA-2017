(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('displayDialougeTestBed', displayDialougeTestBed);
    // In the future this should be a service insead of the main controller. Wouldn't need other files if this change happened, but I didn't have time to refactor this project. 

  /** @ngInject */
  function displayDialougeTestBed($log, dialogueService) {
    var vm = this;
    vm.levelCount = 1; //will only go up if dialogs are successfully completed and show up in nav
    vm.levelUp = false;
    vm.currentConversation = "fran_Linear";
    vm.failedConvos= [];
    vm.dialogList = dialogueService.getDialogKeys();
  }   

})();