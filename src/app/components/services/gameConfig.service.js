(function() {
  'use strict';

  angular.module('awkwardAnnie')
    .service('gameConfig', gameConfig);

  /** @ngInject */
  function gameConfig($http ) {//q
    // var deferred = $q.defer(); //TODO double check this - says it is unused I couldn't find a resolve for it

    var service = {
      version: 0,
      startState: undefined,
      fetchConfig: fetchConfig
    };

    return service;

    function fetchConfig() {
      return $http.get('assets/config.json')
        .then(function(response) {
          angular.extend(service, response.data);
        });
    }
  }
})();
