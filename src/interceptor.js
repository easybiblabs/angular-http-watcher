module.exports = function($httpProvider) {
  'use strict';

  /**
   * $http response interceptor.
   *
   * On response errors it broadcasts a specific event
   * prefixed by 'network:http'. E.g. 'network:http-401'
   * and stores the request on certain http status codes.
   *
   * If you want your request to be ignored, you can use the property
   * ignoreHttpWatcher on the request.
   */
  $httpProvider.interceptors.push(function($rootScope, $q, $injector, httpBuffer, httpWatcherConfig) {
    var config = httpWatcherConfig.getConfig();

    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreHttpWatcher) {
          var storeRequest = config.status[rejection.status] || true;

          if (angular.isDefined(rejection.config.saveOnHttpError)) {
            storeRequest = rejection.config.saveOnHttpError;
          }

          $rootScope.$emit(config.eventNames.error, rejection);

          if (storeRequest) {
            var deferred = $q.defer();
            httpBuffer.append(rejection.config, deferred);
            return deferred.promise;
          }
        }

        return $q.reject(rejection);
      }
    };
  });
};
