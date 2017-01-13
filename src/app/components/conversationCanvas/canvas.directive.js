(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('popUpDialogueManager', popUpDialogueManager);

	/** @ngInject */
	function popUpDialogueManager(conversationP5Data, $log){
		var directive = {
			restrict: "E",
			controller: controller, //controller for this directive
			scope:{
				main: "=",
				animationTitle: "=",
				animationDone: "=",
				numberOfFrames: "=",
				talkingWith: "=",
				hideDialogue: "="
			},
			controllerAs:'vm',
			bindToController: true
		};
		return directive;
		
		/** @ngInject */
		function controller($scope, $element, $timeout){
			var vm = this;

			var myCanvas;
			var dialogueSprite;
			var annieDialogueSprite;
			var newDialogueCanvas;
			var universalSurprised,
					universalConfused,
					universalAnnoyed;

			$scope.$on('$destroy', function(){ 
				newDialogueCanvas.remove();
			});

			/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				p5 object, 2nd canvas for dialogs
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			var dialogueCanvas = function(insetWindow){
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					PRELOAD
						Load images or sounds before used
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				insetWindow.preload = function(){
					universalSurprised = insetWindow.loadSound("assets/sounds/UniversalSurpriseCartoon-option1.wav");
					universalConfused = insetWindow.loadSound("assets/sounds/UniversalConfusedCartoon-option1.wav");
					universalAnnoyed = insetWindow.loadSound("assets/sounds/UniversalAnnoyed.wav");
				};
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					SETUP
						Creates the canvas
						Sets the npc & Annie sprite in the inset view
						Adds animations to each sprite
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				insetWindow.setup = function(){
					insetWindow.frameRate(10);
					// Create canvas
					myCanvas = insetWindow.createCanvas(600,450);
					myCanvas.parent(angular.element($element)[0]);
					myCanvas.class("convoCanvas");
					myCanvas.class("itemRight");
					// Characters
					annieDialogueSprite = insetWindow.createSprite(conversationP5Data.annie.positionX,conversationP5Data.annie.positionY);
					addAnimationsToChar(conversationP5Data.annie,annieDialogueSprite);
					// need to change from talkingWith to var
					dialogueSprite = insetWindow.createSprite(conversationP5Data[vm.main.talkingWith].positionX,conversationP5Data[vm.main.talkingWith].positionY);
					addAnimationsToChar(conversationP5Data[vm.main.talkingWith],dialogueSprite);
				};
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					DRAW
						Set background
						Change sprite's animations
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				insetWindow.draw = function(){
					insetWindow.background('#dae7b9');
					// if sprite has animation for the choice, change it
					if(vm.main.animationTitle !== ""){
						dialogueSprite.changeAnimation(vm.main.animationTitle);
						if(vm.main.animationTitle.indexOf("bold") > 0){
							if(dialogueSprite.animation.getFrame() === dialogueSprite.animation.getLastFrame()){
								if(!vm.main.animationDone){
									vm.main.animationDone = true;
									$scope.$apply();
								}
							}
						}
						dialogueSprite.animation.frameDelay = 1;
						dialogueSprite.animation.looping = false;
						}else{
							dialogueSprite.changeAnimation("normal");
						}
					// Last line
					insetWindow.drawSprites();
				}; //end of draw
			};
			
			newDialogueCanvas = new p5(dialogueCanvas);

			// Only called when title changes, not every draw
			$scope.$watch(function(){return vm.main.animationTitle}, function(newVal,oldVal){
				switch(vm.main.animationTitle){
					case "surprised_bold":
						universalSurprised.play();
						universalSurprised.setVolume(0.2);
						break;
					case "confused_bold":
						universalConfused.play();
						universalConfused.setVolume(0.2);
						break;
					case "annoyed_bold":
						universalAnnoyed.play();
						universalAnnoyed.setVolume(0.2);
						break;
				}
			});

			// Add animation to character sprite from p5 sketck
			function addAnimationsToChar(characterDefinition, characterSprite) { //Char deffinition is from ConversationP5Data service
				for(var animationKey in characterDefinition.animations){
					var frames = [animationKey];
					frames = frames.concat(characterDefinition.animations[animationKey]);
					characterSprite.addAnimation.apply(animationKey, frames);
				}
			}
		}
	}
})();