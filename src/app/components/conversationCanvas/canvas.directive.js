(function() {
  'use strict';

  angular
    .module('awkwardAnnie')
    .directive('popUpDialogManager', popUpDialogManager);

  /** @ngInject */
  function popUpDialogManager(conversationP5Data, $log) {
    var directive = {
      restrict: "E",
      controller: controller, //controller for this directive
      scope: {
        main: "=",
        animationTitle: "=",
        animationDone: "=",
        numberOfFrames: "=",
        talkingWith: "=",
        hideDialog: "="
      },
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    /** @ngInject */
    function controller($scope, $element, $timeout) {
      var vm = this;

      var myCanvas;
      var dialogSprite;
      var annieDialogSprite;
      var newDialogCanvas;
      // var universalSurprised,
      //   universalConfused,
      //   universalAnnoyed;

      $scope.$on('$destroy', function() {
        newDialogCanvas.remove();
      });

      /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      	p5 object, 2nd canvas for dialogs
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
      var dialogCanvas = function(insetWindow) {
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        	PRELOAD// TODO !noteToSelfcheck this image to disable sounds -look here next week:  //thi oneh as niversal 00 it might be used by other animations agh
        		Load images or sounds before used //!noteToSelfcheck this image to disable sounds -look here next week
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        //TODO still wotking on it - seems to be working so far
        insetWindow.preload = function() {
          // universalSurprised =""//insetWindow.loadSound("assets/sounds/UniversalSurpriseCartoon-option1.wav");
          // universalConfused = ""//insetWindow.loadSound("assets/sounds/UniversalConfusedCartoon-option1.wav");
          // universalAnnoyed =  ""//insetWindow.loadSound("assets/sounds/UniversalAnnoyed.wav");
        };
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        	SETUP
        		Creates the canvas
        		Sets the npc & Annie sprite in the inset view
        		Adds animations to each sprite
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        insetWindow.setup = function() {
          insetWindow.frameRate(10);
          // Create canvas
          myCanvas = insetWindow.createCanvas(600, 450);
          myCanvas.parent(angular.element($element)[0]);
          myCanvas.class("convoCanvas");
          myCanvas.class("itemRight");
          // Characters
          annieDialogSprite = insetWindow.createSprite(conversationP5Data.annie.positionX, conversationP5Data.annie.positionY);
          addAnimationsToChar(conversationP5Data.annie, annieDialogSprite);

          dialogSprite = insetWindow.createSprite(conversationP5Data[vm.main.talkingWith].positionX, conversationP5Data[vm.main.talkingWith].positionY);
          addAnimationsToChar(conversationP5Data[vm.main.talkingWith], dialogSprite);
        };
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        	DRAW
        		Set background
        		Change sprite's animations
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        insetWindow.draw = function() {
          insetWindow.background('#dae7b9');
          // if sprite has animation for the choice, change it
          if (vm.main.animationTitle !== "") {
            dialogSprite.changeAnimation(vm.main.animationTitle);
            if (vm.main.animationTitle.indexOf("bold") > 0) {
              if (dialogSprite.animation.getFrame() === dialogSprite.animation.getLastFrame()) {
                if (!vm.main.animationDone) {
                  vm.main.animationDone = true;
                  $scope.$apply();
                }
              }
            }
            dialogSprite.animation.frameDelay = 1;
            dialogSprite.animation.looping = false;
          } else {
            dialogSprite.changeAnimation("normal");
          }

          insetWindow.drawSprites();
        };
      };

      newDialogCanvas = new p5(dialogCanvas);

      //Only called when title changes, not every draw
      // $scope.$watch(function() {
      //   return vm.main.animationTitle
      // }, function(newVal, oldVal) {
      //   switch (vm.main.animationTitle) {
      //     case "surprised_bold":
      //       universalSurprised.play();
      //       universalSurprised.setVolume(0.2);
      //       break;
      //     case "confused_bold":
      //       universalConfused.play();
      //       universalConfused.setVolume(0.2);
      //       break;
      //     case "annoyed_bold":
      //       universalAnnoyed.play();
      //       universalAnnoyed.setVolume(0.2);
      //       break;
      //   }
      // });

      // Add animation to character sprite from p5 sketck
      function addAnimationsToChar(characterDefinition, characterSprite) { //Char deffinition is from ConversationP5Data service
        for (var animationKey in characterDefinition.animations) {
          var frames = [animationKey];
          frames = frames.concat(characterDefinition.animations[animationKey]);
          characterSprite.addAnimation.apply(characterSprite, frames);
        }
      }
    }
  }
})();
