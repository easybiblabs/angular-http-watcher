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
  $httpProvider.interceptors.push(function($rootScope, $q, httpBuffer) {
    var defaultSave = {
      0: true,
      408: true,
      401: true
    };

    var eventName = 'network:http-error';

    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreHttpWatcher) {
          var storeRequest = defaultSave[rejection.status] || false;

          if (angular.isDefined(rejection.config.saveOnHttpError)) {
            storeRequest = rejection.config.saveOnHttpError;
          }

          $rootScope.$emit(eventName, rejection);

          if (storeRequest) {
            var retries = 0;
            if (angular.isDefined(rejection.config.headers['X-RETRIES'])) {
              retries = rejection.config.headers['X-RETRIES'];

              if (rejection.config.maxRetries === retries) {
                return $q.reject(rejection);
              }
            }
            rejection.config.headers['X-RETRIES'] = retries + 1;

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
