(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('displayDialogTestBed', displayDialogTestBed);

  /** @ngInject */
  function displayDialogTestBed($log, $scope, $timeout, dialogService, parseAAContentService, conversationP5Data, levelDataHandler, $stateParams) {
    var vm = this;
    vm.currentConversation = "fran_Linear";
    vm.talkingWith = "fran";
    vm.hasLoaded = false;
    vm.loadFromFile = loadFromFile;
    vm.currentSource = "Website";
    vm.animationValid = true;
    vm.successPaths = [];
    vm.flipDialog = true;

    dialogService.loadFromServer($stateParams.gameType).then(
      function() {
        dialogService.deferred.resolve();
        activate();
      });

    function activate() {
      vm.levelCount = 1;
      vm.levelUp = false;
      vm.failedConvos = [];
      vm.dialogList = dialogService.getDialogKeys()
        .map(function(dkey) {
          return {
            label: dkey + ' [' + dialogService.dialogWorksheetKeys[dkey] + ']',
            key: dkey
          };
        });
      vm.displayCharacters = true;
      vm.hasLoaded = true;
      vm.currentChoiceInfo = {};

      $scope.$watch(function() {return vm.currentConversation;}, function(newVal, oldVal) {
        vm.branchHistory = [];
        vm.talkingWith = vm.currentConversation.split("_")[0];
        vm.displayCharacters = false;
        $timeout(function() {
          vm.displayCharacters = true;
        }, 0);
      });

      $scope.$watch(function() {return vm.currentChoiceInfo; }, function() {
        if (!vm.currentChoiceInfo.animation) {
          vm.animationValid = true;
        } else {
          vm.animationValid = conversationP5Data[vm.talkingWith].animations[vm.currentChoiceInfo.animation];
        }

        vm.isSuccessfulPath = levelDataHandler.successPaths.indexOf(vm.currentChoiceInfo.code) >= 0;
      });
    }

    function loadFromFile(fileObject) {
      if (fileObject.name.indexOf(".xlsx") < 0) {
        alert("Sorry, but " + fileObject.name + " is not an XLSX Excel File!");
        return;
      }

      vm.hasLoaded = false;

      vm.status = "Loading from file '" + fileObject.name + "' ...";
      vm.currentSource = fileObject.name + ' (local)';
      parseAAContentService.parseContentFromFile(fileObject)
        .then(function() {
          vm.status = "Loaded from file '" + fileObject.name + "'.";
          vm.lastFileObject = fileObject;
          vm.hasLoaded = true;
        });
    }

  }

})();
