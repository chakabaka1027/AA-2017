(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .service('mappingService', mappingService);

  /** @ngInject */
  function mappingService() {
    // var userID;
    var map = {
      room1: {
        right_door: "room2",
        lower_right_door: "room6"
      },
      room2: {
        left_door: "room1",
        lower_left_door: "room6",
        lower_right_door: "room4"
      },
      room3: {
        right_door: "room6"
      },
      room4: {
        left_door: "room6",
        top_right_door: "room2"
      },
      room5: {
        top_right_door: "room6"
      },
      room6: {
        left_door: "room3",
        top_left_door: "room1",
        top_right_door: "room2",
        right_door: "room4",
        lower_right_door: "room5"
      }

      /*
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

      */

    };
    return map;
  }
})();
