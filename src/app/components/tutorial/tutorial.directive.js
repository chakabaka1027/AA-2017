(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.directive('simpleTutorial', simpleTutorial);

	var states = {
	    start: {
	        npcText: 'Hi, Annie, Welcome to your first day at work.',
	        pcOptions: [
	            {text: 'Thanks, but I\’d rather be at home playing video games.', nextState: 's1'}
	        ]
	    },
	    s1: {
	        npcText: 'Oh, well, I\’d heard you had a bit of an awkward personality.',
	        pcOptions: [
	            {text: 'They call me Awkward Annie.  Everyone has their strength - mine is making people uncomfortable.', nextState: 's2'}
	        ]
	    },
		s2: {
	        npcText: 'That\'s certainly a special skill.',
	        pcOptions: [
	            {text: 'You know I just popped a giant zit on my nose before I got here.', nextState: 's3'}
	        ]
	    },
	    s3: {
	        npcText: 'OH.  So are you ready to start your first day at work?',
	        pcOptions: [
	            {text: 'Sure.', nextState: 's3a'},
	            {text: 'Sure, but before we do - I\’ve got to tell you that the shirt in your profile picture is the ugliest one I\’ve ever seen.', nextState: 's4'}
	        ]
	    },
		s3a: {
	        npcText: 'I\’m surprised you don’t have something more awkward to say. So are you ready to start your first day at work?',
	        pcOptions: [
	            {text: 'Sure.', nextState: 's3a'},
	            {text: 'Sure, but before we do - I\’ve got to tell you that is the ugliest shirt I\’ve ever seen.', nextState: 's4'}
	        ]
	    },

	    s4: {
	        npcText: 'What?  I bought this shirt at Snooty Toots, the high end fashion boutique. I think it\’s time I show you to your desk.',
	        pcOptions: [
	            {text: 'Thanks. That would really be nice of you.', nextState: 's4a'},
	            {text: 'Desk, shmesh.  Let’s go get a drink at the bar - I heard they make a great morning cocktail.', nextState: 'end'}
	        ]
	    },
	    s4a: {
	        npcText: 'I\’m surprised you don’t have something more awkward to say, Annie.',
	        pcOptions: [
	            {text: 'Thanks. That would really be nice of you.', nextState: 's4a'},
	            {text: 'Desk, shmesh.  Let’s go get a drink at the bar - I heard they make a great morning cocktail.', nextState: 'end'}
	        ]
	    },
	    end: {
	        npcText: 'You’ll certainly make this office more interesting. I’m sure your awkward annie shenanigans will liven things up around here. As they say - you do you, Awkward Annie.'
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
					$('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
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