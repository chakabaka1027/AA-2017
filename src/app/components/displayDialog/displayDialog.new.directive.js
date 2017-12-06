(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .directive('displayDialog', displayDialog);

  /** @ngInject */
  function displayDialog($log, parseAAContentService, nodeDataService, dialogService) {
    return {
      restrict: 'E',
      controller: controller,
      scope: {
        main: "=",
        isTestBed: "="
      },
      controllerAs: 'vm',
      bindToController:true,
      templateUrl: 'app/components/displayDialog/displayDialog.html'
    };

    function controller($scope) {
      var vm = this;

      vm.choiceDelay = true;
      vm.dialogKey = vm.main.currentConversation;
      vm.curNode = undefined;

      vm.showNode = vm.clickOnChoice = clickOnChoice; // same as saying public funcitn click on choice

      setupForNode();
      function setupForNode() {
        vm.currentNodeChoices = [];
        if (vm.curNode) {
          angular.forEach(vm.curNode.children, function(child) {
            vm.currentNodeChoices.push({choice:child.choiceCode, node: child});
          });
          vm.showContinue = vm.currentNodeChoices.length===0;
          if (vm.showContinue) {
            $log.log('Success: '+vm.curNode.success+'; Score '+vm.curNode.score);
          }
        }
      }

      $scope.$watch(function(){return vm.main.currentConversation;}, function() {
        vm.dialogKey = vm.main.currentConversation;
        console.log("in watch ",vm.dialogKey);

        if(vm.dialogKey){//was commented 
          nodeDataService.parseFromDialogTree(vm.dialogKey).then(function(curTree){
            console.log("-------- did this happen ",curTree);
            vm.curTree = curTree;
            vm.curNode = vm.curTree.rootNode;
            setupForNode();
        });
      }

      });

      function clickOnChoice(choice) {
        // scoring, tracking etc. happens; then...

    		var chosenNode = vm.curNode.children[choice];
    		vm.curNode = chosenNode;
        setupForNode();

    	}

    }

  }

})();