module.exports = function($rootScope, httpBuffer) {
  'use strict';

  return {
    /**
     * Call this function if you want to know how many http request are
     * currently in the queue.
     */
    size: function() {
      return httpBuffer.size();
    },

    /**
     * Call this function to indicate you want to continue retrying all requests,
     * after beeing back online or beeing successfully logged in again
     *
     * @param data an optional argument to pass on to $broadcast which may be useful for
     * example if you need to pass through details of the user that was logged in
     * @param configUpdater an optional transformation function that can modify the
     * requests that are retried after having logged in.  This can be used for example
     * to add an authentication token.  It must return the request.
     */
    continue: function(data, configUpdater) {
      var updater = configUpdater || function(config) {return config;};
      $rootScope.$emit('network:continue', data);
      return httpBuffer.retryAll(updater);
    },

    /**
     * Call this function to indicate that you want to throw away everything.
     * All deferred requests will be abandoned or rejected (if reason is provided).
     *
     * @param data an optional argument to pass on to $broadcast.
     * @param reason if provided, the requests are rejected; abandoned otherwise.
     */
    reject: function(data, reason) {
      httpBuffer.rejectAll(reason);
      $rootScope.$broadcast('network:reject', data);
    }
  };
};
