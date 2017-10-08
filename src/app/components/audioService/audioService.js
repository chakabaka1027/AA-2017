(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .service('audioService', audioService);

  /** @ngInject */
  function audioService($log, $window) {

    var audioFolder = 'assets/sounds/';

    var service = {
      audioTags: {},
      playAudio: function(fname) {
        var audioTag = service.audioTags[fname];
        if (audioTag) {
          audioTag.currentTime = 0;
          audioTag.play();
        } else {
          audioTag = new $window.Audio(audioFolder + fname);
          service.audioTags[fname] = audioTag;
          audioTag.play();
        }
      }
    };

    return service;

  }

})();


/*work around that may fix the chrome dome error - but not sure if needed, most of the posts online suggest it is a chrome bug - does not affect the game as far as I can tell 
https://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error*/
