(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .service('mappingService', mappingService);

  /** @ngInject */
  function mappingService() {
    var userID;
    var map = {
      anniesOffice: {
        left_door: "lobby",
        top_right_door: "conferenceRoom"
      },
      mikesOffice: {
        right_door: "conferenceRoom",
        lower_right_door: "lobby"
      },
      fransOffice: {
        right_door: "lobby"
      },
      lobby: {
        left_door: "fransOffice",
        top_left_door: "mikesOffice",
        top_right_door: "conferenceRoom",
        right_door: "anniesOffice",
        lower_right_door: "breakRoom"
      },
      breakRoom: {
        top_right_door: "lobby"
      },
      conferenceRoom: {
        left_door: "mikesOffice",
        lower_left_door: "lobby",
        lower_right_door: "anniesOffice"
      }
    };
    return map;
  }
})();
