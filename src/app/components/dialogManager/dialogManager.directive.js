(function(){
	'use strict';

	angular
		.module('awkwardAnnie')
		.directive('displayDialog', displayDialog);

	/** @ngInject */
	function displayDialog(dialogService, userDataService, audioService, $log, conversationP5Data, levelDataHandler) {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/dialogManager/dialogManager.html',
			controller: displayDialogController,
			scope: {
				main: "=",
				isTestBed: "="
			},
			controllerAs: 'vm',
			bindToController: true
		};
		return directive;
		
		/** @ngInject */
		function displayDialogController($scope, $timeout){
			var vm = this;
			var dialogRoot;
			var codeNode2;
			var pc_Text_Timer =  350;
			var pc_npc_timer = pc_Text_Timer + 400;
			var mild_Animation_Timer =  1000;
			var noExpression_Timer =  700;
			var latestChoice = {};
			var npc = "";
			var decisionPath = "";
			var randomChoices = [];
			var successfulConvos;
			var scores = {
				A:0,
				B:3,
				C:5
			};
			vm.choiceDelay = true;
			vm.main.totalConvoPoints = 0;
			vm.showContinue = false;
			vm.clickContinue = clickContinue; 
			vm.showNode2 = showNode2;
			vm.showNode3 = showNode3;
			vm.showNode3Response = showNode3Response;
			vm.chosenAnnie = "";
			vm.npcResponse = "";
			vm.node1Hidden = false;
			vm.node2Hidden = true;
			vm.node3Hidden = true;
			vm.node3Response = true;

			// for debugging in testbed...
			vm.main.branchHistory = [];
			vm.main.currentChoiceInfo = {};



			$scope.$watch(function(){ return vm.main.currentConversation;}, function(){
				resetDialog();
				chooseDialogScript();

			});

			function resetDialog(){
				npc = "";
				decisionPath = "";
				randomChoices = [];
				successfulConvos;
				scores = {
					A:0,
					B:3,
					C:5
				};

				vm.choiceDelay = true;
				vm.main.totalConvoPoints = 0;
				vm.showContinue = false;
				vm.chosenAnnie = "";
				vm.npcResponse = "";
				vm.node1Hidden = false;
				vm.node2Hidden = true;
				vm.node3Hidden = true;
				vm.node3Response = true;
			}

			// Set dialog - move to another file, will need info from main controller
			function chooseDialogScript(){
				npc = vm.main.talkingWith;
				vm.main.animationTitle = "";
				//Get branching conversation data
				var dialog = vm.main.currentConversation;
				dialogService.getDialogs(dialog).then(function(data){
					dialogRoot = data;
					// save choices to an array
					var originalNodeOne = dialogRoot.node1;
					// Shuffle node one, can't shuffle others until 
					randomChoices = shuffle(originalNodeOne);
					// Give new array to DOM
					vm.choice = originalNodeOne;
					vm.choice2 = dialogRoot.node2;
					vm.choice3 = dialogRoot.node3;
					vm.main.isLinearDialog = vm.choice.length===1;
				});
				// vm.main.failedConvos[vm.main.currentConversation];
				if(angular.isUndefined(vm.main.failedConvos[vm.main.currentConversation])){
					vm.main.failedConvos[vm.main.currentConversation] = 0;
				}
			}

			/*=============== Button operations =================*/
			function showNode2(choice){ //first click
				audioService.playAudio("UIbuttonclick-option2.wav");  //button click sound
				vm.npcResponse = "";
				// Hide/show other choices
				vm.node1Hidden = true;
				vm.node2Hidden = false; //show if choice is clicked
				vm.node3Hidden = true;
				// Set dialog data for current node
				vm.node1Response = choice;

				codeNode2 = choice.code;
				// Shuffle choices
				var originalNodeTwo = dialogRoot.node2[codeNode2];
				vm.choice2 = originalNodeTwo; //data needed to pull up choices
				loadResponses(choice); // Responses with timers
				// Data
				var currenBranch = choice.code.charAt(0);


				trackBranches(currenBranch);


				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_state","1",vm.main.failedConvos[vm.main.currentConversation]);
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_user",currenBranch, choice.PC_Text);

				if(!vm.isTestBed){
					userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_system",scores[currenBranch],randomChoices.indexOf(choice)+1);
				}
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_NPC",choice.animation,choice.NPC_Response); //text_position
				randomChoices = shuffle(originalNodeTwo);//shuffle next choices
			}//end of showNode2

			function showNode3(choice){
				audioService.playAudio("UIbuttonclick-option2.wav"); 
				// Hide/show neccessary items
				vm.node3Hidden = false; //show choice if clicked
				vm.node2Hidden = true;
				vm.node2Response = choice;
				// Get button code
				var codeNode3 = choice.code;
				// Get choices for next round
				var originalNodeThree = dialogRoot.node3[codeNode3];
				vm.choice3 = originalNodeThree; //send them to the dom
				// Set animation information
				// vm.main.animationTitle = choice.animation;
				loadResponses(choice);
				// Data
				var currenBranch = choice.code.charAt(1);

				trackBranches(currenBranch);


				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_state","2",vm.main.failedConvos[vm.main.currentConversation]);
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_user",currenBranch, choice.PC_Text);
				
				if (!vm.isTestBed){
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_system",scores[currenBranch],randomChoices.indexOf(choice)+1);
				}

				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_NPC",choice.animation,choice.NPC_Response); //text_position
				randomChoices = shuffle(originalNodeThree); //shuffle them
			}//end of showNode3
			
			function showNode3Response(choice){ //choice parameter
				audioService.playAudio("UIbuttonclick-option2.wav"); 
				vm.node3Hidden = true;
				// vm.main.animationTitle = choice.animation;
				// hasAnimation(choice);
				vm.npcResponse = ""; 	// clear response before showing next
				loadResponses(choice);
				vm.showContinue = true;
				
				// check success
				if(!vm.isTestBed){

					// $log.log('Checking for level success... these arrays should be the same...');
					// $log.log(levelDataHandler.getSuccessPaths(vm.main.currentConversation));
					// $log.log(vm.main.roomData.characters[vm.main.talkingWith].successPaths);

					if(vm.main.roomData.characters[vm.main.talkingWith].successPaths.indexOf(choice.code) >= 0){
						vm.main.completedConvos.push(vm.main.currentConversation);
						// Calculate score
						vm.main.totalConvoPoints = 0;
						for(var i in choice.code){
							vm.main.totalConvoPoints += scores[choice.code[i]];
						}
						// vm.main.playerScore += vm.main.totalConvoPoints; //update score

						vm.main.lastConversationSuccessful = true;
					}else{
						vm.main.failedConvos[vm.main.currentConversation] += 1;
						vm.main.lastConversationSuccessful = false;
					}
				}	
				// Data
				var currenBranch = choice.code.charAt(2);

				trackBranches(currenBranch);

				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_state","3",vm.main.failedConvos[vm.main.currentConversation]);
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_user",currenBranch, choice.PC_Text);
				if (!vm.isTestBed){
					userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_system",scores[currenBranch],randomChoices.indexOf(choice)+1);

				}
				userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_NPC",choice.animation,choice.NPC_Response); //text_position
				decisionPath = choice.code;
			}

			function trackBranches(currentBranch){

				vm.main.branchHistory.push(currentBranch);
				// $log.log('currentBranch', 'node'+(vm.main.branchHistory.length+1), vm.main.branchHistory.join(''));

			}

			function clickContinue(){
				vm.main.hideDialog = true;
				vm.chosenAnnie = "";
				vm.npcResponse = "";
				vm.node1Hidden = false;
				vm.node2Hidden = true;
				vm.node3Hidden = true;
				vm.showNPCbubbleText = true;
				vm.NPC_responseHidden = true;
				vm.node3Response = true;
				vm.showContinue = false;
				vm.main.animationTitle = "";

				// End of convo data
				if (!vm.isTestBed){
					if(vm.main.lastConversationSuccessful){
						userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_result",vm.main.totalConvoPoints,decisionPath);
						userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_end",vm.main.currentConversation,"Success");
					}else{
						userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_result",vm.main.totalConvoPoints,decisionPath);
						userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"convo_end",vm.main.currentConversation,"Fail");
					}
					userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"NPC_state",vm.main.talkingWith);
					var progressBarInfo = Math.round((vm.main.completedConvos.length/vm.main.totalConvosAvailable)*100);
					userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"Player_State",vm.main.playerScore, progressBarInfo);
					successfulConvos = vm.main.completedConvos.length;
					userDataService.trackAction(vm.main.levelCount,vm.main.roomKey,"Game_convo",successfulConvos,vm.main.convoAttemptsTotal);
					userDataService.postData(); //Post data after convo is over
					chooseDialogScript();
				}

				// for debugging in testbed...
				vm.main.branchHistory = [];
				vm.main.currentChoiceInfo = {};

			}

		/*=============== Functions =================*/
			function shuffle(choices){
				if (!vm.isTestBed){
					for(var j, x, i = choices.length; i; j = Math.floor(Math.random() * i), x = choices[--i], choices[i] = choices[j], choices[j] = x);
					return choices;
				}
				
			}

			function loadResponses(choice){

				// for debugging purposes, added by chas...
				vm.main.currentChoiceInfo = choice;

				vm.npcResponse = ""; // clear response before showing next
				vm.choiceDelay = false;
				$timeout( function(){ 
					vm.chosenAnnie = choice.PC_Text; 
				},pc_Text_Timer);

				$timeout(function(){
					if (choice.animation==='' || conversationP5Data[vm.main.talkingWith].animations[choice.animation]) {
						vm.main.animationTitle = choice.animation;
					} else {
						$log.warn('there is no animation "'+choice.animation+'" for character '+vm.main.talkingWith);
						vm.main.animationTitle = '';
					}
					if(vm.main.animationTitle && vm.main.animationTitle.indexOf("bold") >= 0){ //if it has an animated expression, wait until it's done.
						// var npc_vt_anim_timer = vm.main.numberOfFrames * 100; //length of animation
						var watchPromise = $scope.$watch(function(){return vm.main.animationDone;}, function(){
							if(vm.main.animationDone){
									latestChoice = choice;
									audioService.playAudio("UIbuttonclick-option1.wav");
									vm.npcResponse = choice.NPC_Response;
									delayChoiceDisplay();
									watchPromise(); //get's rid of previously created $watch
							}
						});

						//displays responses in the test bed when dialog is complete for awkward convos
						if (vm.isTestBed){
							latestChoice = choice;
							audioService.playAudio("UIbuttonclick-option1.wav");
							vm.npcResponse = choice.NPC_Response;
							delayChoiceDisplay();
							watchPromise(); //get's rid of previously created $watch
						}
						vm.main.animationDone = false; //reset
					}else if(vm.main.animationTitle && vm.main.animationTitle.indexOf("mild") >= 0){ //if mild expression
						$timeout(function(){
							audioService.playAudio("UIbuttonclick-option1.wav");
							vm.npcResponse = choice.NPC_Response;
							delayChoiceDisplay();
						}, mild_Animation_Timer);
					}else{ //if no animation
						$timeout(function(){
							audioService.playAudio("UIbuttonclick-option1.wav");
							vm.npcResponse = choice.NPC_Response;
							delayChoiceDisplay();
						}, noExpression_Timer); 
					}
					// return;
				}, pc_npc_timer); //wait after PC text is shown + extra
				vm.chosenAnnie = "";
				vm.npcResponse = "";
			}

			function delayChoiceDisplay(){
				$timeout(function() {
					vm.choiceDelay = true;
				}, 1200);
			}
		}//end of controller
	}
})();
/*
			function showNextNode(choice){
				if(node != lastNode){
					// Hide/show neccessary items
					put in a loop or just use a global varible reset after continue is clicked 
					set node[i]Hidden = true node[i-1]Hidden = true
					vm.node3Hidden = !vm.node3Hidden;
					vm.node2Hidden = !vm.node2Hidden;
					
					vm.node2Response = choice;
					// Get button code
					var codeNode3 = choice.code;
					// Get choices for next round
					var originalNodeThree = dialogRoot.node3[codeNode3];
					shuffle(originalNodeThree); //shuffle them
					vm.choice3 = originalNodeThree; //send them to the dom
					// Set animation information
					vm.main.animationTitle = choice.animation;
					loadResponses(choice);
				}else{
						showContinue();
				}
			}
*/