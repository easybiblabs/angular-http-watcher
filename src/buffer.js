module.exports = function($injector, $q) {
  'use strict';

  var buffer = [];
  var $http;

  function retryHttpRequest(config, deferred) {
    function successCallback(response) {
      deferred.resolve(response);
    }
    function errorCallback(response) {
      deferred.reject(response);
    }
    $http = $http || $injector.get('$http');
    return $http(config).then(successCallback, errorCallback);
  }

  return {
    size: function() {
      return buffer.length;
    },

    append: function(config, deferred) {
      buffer.push({
        config: config,
        deferred: deferred
      });
    },

    rejectAll: function(reason) {
      if (reason) {
        for (var i = 0; i < buffer.length; ++i) {
          buffer[i].deferred.reject(reason);
        }
      }
      buffer = [];
    },

    retryAll: function(updater) {
      var promiseArray = [];

      for (var i = 0; i < buffer.length; ++i) {
        promiseArray.push(
          retryHttpRequest(
            updater(buffer[i].config),
            buffer[i].deferred
          )
        );
      }

      buffer = [];

      return $q.all(promiseArray);
    }
  };
};
