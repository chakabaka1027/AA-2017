(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .directive('simpleTutorial', simpleTutorial);

  var localgameType; //just for testing
  var posStates = {
    start: {
      npcText: ' Hi, Annie, Welcome to your first day at work..',
      pcOptions: [{
        text: 'Thanks, but I\’m a bit nervous about saying the wrong things to people.',
        nextState: 's1'
      }]
    },
    s1: {
      npcText: 'Oh, yeah, I remember you struggling with that when we were younger.',
      pcOptions: [{
        text: 'Ha, they called me Awkward Annie.  Everyone has their strength - mine is saying the inappropriate thing.  ',
        nextState: 's2'
      }]
    },
    s2: {
      npcText: 'That\'s certainly a special skill.',
      pcOptions: [{
        text: 'Yeah, I\’m doing better now though. I just pay more attention to which things I should say and which I should keep to myself. ',
        nextState: 's3'
      }]
    },
    s3: {
      npcText: 'OK.  So are you ready to start your first day at work?',
      pcOptions: [{
          text: 'Sure thing \“Fran-cy Pants\”! Get it, I combined your name with \“Fancy Pants\”. It\’s funny right?',
          nextState: 's3a'
        },
        {
          text: 'Absolutely. I hope I don’t offend too many people today.  ',
          nextState: 's4'
        }
      ]
    },


    s3a: {
      npcText: 'What? I don’t think those kind of nicknames are exactly office appropriate. We’re not in high school anymore. So are you ready to start your first day at work? ',
      pcOptions: [{
          text: 'Sure thing \“Fran-cy Pants\”! Get it, I combined your name with \“Fancy Pants\”. It\’s funny right?',
          nextState: 's3a'
        },
        {
          text: 'Absolutely. I hope I don’t offend too many people today.  ',
          nextState: 's4'
        }
      ]
    },

    s4: {
      npcText: 'I hope not either. I think it\’s time to meet in the lobby',
      pcOptions: [{
          text: 'Great! My brain sometimes farts out comments that people take as inappropriate. Not everyone appreciates bathroom humor.  ',
          nextState: 's4a'
        },
        {
          text: 'Great! Maybe you can help me to be sure and only say things that don\’t make for awkward situations.',
          nextState: 's5'
        }
      ]
    },
    s4a: {
      npcText: 'Yeah, see. You’re already talking about topics that are a bit awkward to do in the office. Maybe you should try to keep that stuff inside your head. Are you ready to get started?',
      pcOptions: [{
          text: 'Great! My brain sometimes farts out comments that people take as inappropriate. Not everyone appreciates bathroom humor.  ',
          nextState: 's4a'
        },
        {
          text: 'Great! Maybe you can help me to be sure and only say things that don\’t make for awkward situations.',
          nextState: 's5'
        }
      ]
    },
    s5: {
      npcText: 'You\’ll certainly make this office more interesting. I\’m sure your awkward annie shenanigans will liven things up around here. Good luck trying to change your reputation as Awkward Annie. ',
      pcOptions: [{
        text: 'Thanks. ',
        nextState: 'end'
      }]
    },
    end: {
      // npcText: 'Great...'
    }
  };


  var negStates = {
    start: {
      npcText: 'Hi, Annie, Welcome to your first day at work.',
      pcOptions: [{
        text: 'Thanks, but I\’d rather be at home playing video games.',
        nextState: 's1'
      }]
    },
    s1: {
      npcText: 'Oh, well, I\’d heard you had a bit of an awkward personality.',
      pcOptions: [{
        text: 'They call me Awkward Annie.  Everyone has their strength - mine is saying inappropriate things. ',
        nextState: 's2'
      }]
    },
    s2: {
      npcText: 'That\'s certainly a special skill.',
      pcOptions: [{
        text: 'Yeah, well I like being \“special\”. I\’m like a special agent of awkwardness. Unstoppable awkwardness! ',
        nextState: 's3'
      }]
    },
    s3: {
      npcText: 'Ok.  So are you ready to start your first day at work?',
      pcOptions: [{
          text: 'I sure am. Let\’s get things started. This should be a fun day.',
          nextState: 's3a'
        },
        {
          text: 'What? You don\’t like my “special agent of awkwardness” joke? What happened to your sense of humor? Oh, no. Is this a boring office? ',
          nextState: 's4'
        }
      ]
    },
    s3a: {
      npcText: 'I\’m surprised you don\’t have something more awkward to say. So are you ready to start your first day at work?  ',
      pcOptions: [{
          text: 'I sure am. Let\’s get things started. This should be a fun day.',
          nextState: 's3a'
        },
        {
          text: 'What? You don\’t like my “special agent of awkwardness” joke? What happened to your sense of humor? Oh, no. Is this a boring office? ',
          nextState: 's4'
        }
      ]
    },

    s4: {
      npcText: 'What? No, people definitely have a sense of humor. You just tend to take things a bit farther than most people do. I forgot what it\’s like to be \“Akward Annie.\” Anyway, I think it\’s time to meet in the lobby. ',
      pcOptions: [{
          text: 'Thanks. That would really be nice of you.',
          nextState: 's4a'
        },
        {
          text: 'The lobby?! That sounds like a great place to get this party started! You do have party decorations and noise makers, right? A dance party always gets the day started right.',
          nextState: 's5'
        }
      ]
    },
    s4a: {
      npcText: 'I\’m surprised you don\’t have something more awkward to say, Annie.',
      pcOptions: [{
          text: 'Thanks. That would really be nice of you.',
          nextState: 's4a'
        },
        {
          text: 'The lobby?! That sounds like a great place to get this party started! You do have party decorations and noise makers, right? A dance party always gets the day started right.',
          nextState: 's5'
        }
      ]
    },
    s5: {
      npcText: 'You\’ll certainly make this office more interesting. I\’m sure your awkward annie shenanigans will liven things up around here. As they say - you do you, Awkward Annie. ',
      pcOptions: [{
        text: 'Thanks.',
        nextState: 'end'
      }]
    },
    end: {
      // npcText: 'Great...'
    }
  };

  function simpleTutorial($log, $timeout, audioService, $location) {

    var path = $location.path();
    var p = path.toString();
    if (p.includes("positive")) {
      localgameType = true;
    } else {
      localgameType = false;
    }


    return {
      restrict: 'E',
      controller: controller,
      bindToController: true,
      controllerAs: 'tut',
      templateUrl: 'app/components/tutorial/tutorial.html'
    };



    function controller($scope) {


      var vm = this;
      vm.showingNPCtext = false;
      vm.showingDialogOptions = false;

      var scrollTimer;
      var showTimer;
      var hideTimer;

      delayDialog();

      vm.gotoState = function(pcOption) {
        audioService.playAudio("UIbuttonclick-option2.wav");
        if (localgameType === true) {
          vm.textRows.push({
            npcText: vm.curState.npcText,
            pcText: pcOption.text
          });
          vm.curState = posStates[pcOption.nextState];
          vm.curStateName = pcOption.nextState;
        } else {
          vm.textRows.push({
            npcText: vm.curState.npcText,
            pcText: pcOption.text
          });
          vm.curState = negStates[pcOption.nextState];
          vm.curStateName = pcOption.nextState;
        }

        delayDialog();

        vm.showingNPCtext = false;
        vm.showingDialogOptions = false;



        //scroll after pc and npc response
        $timeout(function() {
          $('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
        }, 10);

        $timeout.cancel(scrollTimer);
        scrollTimer = $timeout(function() {
          $('.text-simulator').scrollTop($('.text-simulator')[0].scrollHeight - $('.text-simulator').innerHeight());
        }, 1500);

      }

      vm.resetState = function() {
        vm.textRows = [];
        if (localgameType === true) {
          vm.curState = posStates['start'];
          vm.curStateName = 'start';
        } else {
          vm.curState = negStates['start'];
          vm.curStateName = 'start';
        }

      }

      vm.resetState();
      $scope.$on("$destroy", onDestroy);


      function delayDialog() {

        $timeout.cancel(showTimer);

        showTimer = $timeout(function() {
          vm.showingNPCtext = true;
          audioService.playAudio("UIbuttonclick-option1.wav");
        }, 1500);

        $timeout.cancel(hideTimer);

        hideTimer = $timeout(function() {
          vm.showingDialogOptions = true;
        }, 2500);

      }

      function onDestroy() {
        $timeout.cancel(showTimer);
        $timeout.cancel(hideTimer);
        $timeout.cancel(scrollTimer);
      }


    }
  }
})();
