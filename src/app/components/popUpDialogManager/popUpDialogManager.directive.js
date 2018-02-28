(function() {
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('popUpDialogManager', popUpDialogManager);

	/** @ngInject */
	function popUpDialogManager(conversationP5Data, mainInformationHandler, dialogOptions, $log, parseAAContentService) {// add this here - dialogOptions
		var directive = {
			restrict: "E",
			controller: controller,
			scope: {

/*
				main: "=",
				animationTitle: "=",
				animationDone: "=",
				// numberOfFrames: "=",
				talkingWith: "=",
				hideDialog: "="
*/

			},
			controllerAs: 'vm',
			bindToController: true
		};
		return directive;

		/** @ngInject */
		function controller($scope, $element) {
			// var vm = this;

			var myCanvas;
			var dialogSprite;
			var annieDialogSprite;
			var newDialogCanvas;
			var universalSurprised, //comment this later
			  universalConfused,
			  universalAnnoyed;

			$scope.$on('$destroy', function() {
				newDialogCanvas.remove();
			});

			/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				p5 object, 2nd canvas for dialogs
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			var dialogCanvas = function(insetWindow) {
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					PRELOAD//  uncomment  required varibles above, preload section and the
					 the watch section  below if you want to have sounds inside dialougs
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				insetWindow.preload = function() {
					if(parseAAContentService.getLevelDataForURL().audioSetting){
						universalSurprised =insetWindow.loadSound("assets/sounds/UniversalSurpriseCartoon-option1.wav");
						universalConfused = insetWindow.loadSound("assets/sounds/UniversalConfusedCartoon-option1.wav");
						universalAnnoyed =  insetWindow.loadSound("assets/sounds/UniversalAnnoyed.wav");
					}

				};
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					SETUP
						Creates the canvas
						Sets the npc & Annie sprite in the inset view
						Adds animations to each sprite
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				insetWindow.setup = function() {
					insetWindow.frameRate(10);
					myCanvas = insetWindow.createCanvas(600, 450);
					myCanvas.parent(angular.element($element)[0]);
					myCanvas.class("convoCanvas");
					myCanvas.class("itemRight");

					annieDialogSprite = insetWindow.createSprite(conversationP5Data.annie.positionX, conversationP5Data.annie.positionY);
					addAnimationsToChar(conversationP5Data.annie, annieDialogSprite);
					dialogSprite = insetWindow.createSprite(conversationP5Data[dialogOptions.talkingWith].positionX, conversationP5Data[dialogOptions.talkingWith].positionY);
					// console.log("dialogSprite", dialogSprite);
					addAnimationsToChar(conversationP5Data[dialogOptions.talkingWith], dialogSprite);
				};
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					DRAW
						Set background
						Change sprite's animations
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				insetWindow.draw = function() {
					insetWindow.background('#dae7b9');
					// if sprite has animation for the choice, change it
					if (dialogOptions.animationTitle.trim() !== "") {
						dialogSprite.changeAnimation(dialogOptions.animationTitle);
						if (dialogOptions.animationTitle.indexOf("bold") > 0) {
							if (dialogSprite.animation.getFrame() === dialogSprite.animation.getLastFrame()) {
								if (!dialogOptions.animationDone) {
									dialogOptions.animationDone = true;
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

			/*     uncomment this section if you want to have sounds inside dialougs      */
						// Only called when title changes, not every draw

						$scope.$watch(function() {return dialogOptions.animationTitle}, function(newVal, oldVal) {
							if(parseAAContentService.getLevelDataForURL().audioSetting){

							switch (dialogOptions.animationTitle) {
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
							}}
						});

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
