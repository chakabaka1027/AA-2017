(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('simpleTutorial', simpleTutorial);

	var states = {
	    start: {
	        npcText: 'Hello, A.',
	        pcOptions: [
	            {text: 'Why, hello!', nextState: 's1'}
	        ]
	    },
	    s1: {
	        npcText: 'Well, welcome to our humble workspace.',
	        pcOptions: [
	            {text: 'You are most kind, dear sir; I am flattered.', nextState: 's1a'},
	            {text: 'I am seriously crazy person, now I want kill you GRRRRR!!!!!', nextState: 's2'}
	        ]
	    },
	    s1a: {
	        npcText: 'That doesn\'t seem quite crazy enough.',
	        pcOptions: [
	            {text: 'Well, I\'m not actually a psycho.', nextState: 's1a'},
	            {text: 'Wait, no... I AM crazy person, hate you, GRRRRR!!!!!', nextState: 's2'}
	        ]
	    },
	    s2: {
	        npcText: 'Wow! You really are pretty crazy, A.!',
	        pcOptions: [
	            {text: 'I\'m terribly sorry, I lost my mind for a moment there. Won\'t happen again.', nextState: 's2a'},
	            {text: 'Yes, kill you. Kill you all!!! Ahh-hahahaha!!!', nextState: 'end'}
	        ]
	    },
	    s2a: {
	        npcText: 'What? We like the cray-cray here, A. Is that a problem?',
	        pcOptions: [
	            {text: 'It\'s just that I\'m not a homicidal maniac; at least I don\'t think I am.', nextState: 's2a'},
	            {text: 'It\'s only a problem if you can avoid my Swiss Army Knife of Death BITCH!!!', nextState: 'end'}
	        ]
	    },
	    end: {
	        npcText: 'Haha - OW!! O god that hurts!! But that is the kind of stabbing that shows you\'ll fit right in, A.!'
	    }
	};

	function simpleTutorial($log, $timeout) {
		return {
			restrict: 'E',
			controller: controller,
			bindToController: true,
			controllerAs: 'tut',
			templateUrl: 'app/components/tutorial/tutorial.html'
		};

		function controller($scope) {
			var vm = this;

			vm.gotoState = function(pcOption) {
				vm.textRows.push({npcText: vm.curState.npcText, pcText: pcOption.text});
				vm.curState = states[pcOption.nextState];
				vm.curStateName =pcOption.nextState;
				$timeout(function() {
					$('.text-simulator').scrollTop($('.text-simulator').innerHeight());
				}, 0);
			} 

			vm.resetState = function() {
				vm.textRows = [];
				vm.curState = states['start'];
				vm.curStateName = 'start';
			}

			vm.resetState();


		}
	}
})();