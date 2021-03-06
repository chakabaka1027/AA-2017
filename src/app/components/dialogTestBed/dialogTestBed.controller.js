(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .controller('displayDialogTestBed', displayDialogTestBed);

  /** @ngInject */
  function displayDialogTestBed($log, $scope, $timeout, dialogService, parseAAContentService, userGameInfo,
                                  conversationP5Data, levelDataHandler, $stateParams, mainInformationHandler, dialogOptions) {
    var vm = this;
    vm.levelData = levelDataHandler.choiceScores;
    vm.currentConversation = "FF.Linear";
    vm.talkingWith = "fran";
    vm.hasLoaded = false;
    vm.loadFromFile = loadFromFile;
    vm.currentSource = "Website";
    vm.localGameType = (userGameInfo.isGamePositive() ? 'positive' : 'negative');
    vm.animationValid = true;
    vm.successPaths = [];
    vm.flipDialog = true;
    // $scope.main = mainInformationHandler;

    $log.log('Ensure dialog service is loaded...');

    dialogService.loadFromServer($stateParams.gameType)
      .then(function() {
        $log.log('dialogTestBed loaded');
        dialogService.deferred.resolve(); // required?
        $log.log('resolved');
        activate();
        $scope.$watch(function(){return vm.localGameType;}, setupForLocalGameType);
        $scope.$watch(function(){return vm.curNode;}, updateNodeOptions);
      });

    function updateNodeOptions() {
      var opts = [];
      if (vm.curNode) {
        angular.forEach(vm.curNode.children, function(v,k) {opts.push(v.code);});
        opts.sort();
      };
      vm.pcOptions = opts.join(', ');
    }

    function setupForLocalGameType() {
      $log.log('setupForGameType '+vm.localGameType);
      angular.forEach(parseAAContentService.parsedDialogContent, function(dialogData, dialogKey) {
        dialogData.dialogTree.setGameType(vm.localGameType);
      });
      $log.log(vm.curNode);
    }

    function characterFromDialogKey(dkey) {
      var cmap = {
        'FF': 'fran', 'MM': 'mike', 'CC': 'charlie', 'LL': 'luna'
      };

      return cmap[dkey.split('.')[0]] || 'luna';
    }

    function activate() {
      vm.levelCount = 1;
      vm.levelUp = false;
      vm.failedConvos = [];
      vm.dialogList = Object.keys(parseAAContentService.parsedDialogContent)
        .map(function(dkey) {
          return {
            label: dkey,
            key: dkey
          };
        });
      vm.displayCharacters = true;
      vm.hasLoaded = true;
      vm.currentChoiceInfo = {};

      $scope.$watch(function() {return vm.currentConversation;}, function() {

        vm.branchHistory = []; //temporary fix below

        vm.talkingWith = characterFromDialogKey(vm.currentConversation); // "fran";

        vm.displayCharacters = false;
        mainInformationHandler.currentConversation = vm.currentConversation;
        dialogOptions.talkingWith = vm.talkingWith;
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
          vm.dialogList = Object.keys(parseAAContentService.parsedDialogContent)
            .map(function(dkey) {
              return {
                label: dkey,
                key: dkey
              };
            });
        });
    }

  }

})();
