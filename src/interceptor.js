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

    return {
      /* eslint-disable complexity */
      responseError: function(rejection) {
        if (!rejection.config.ignoreHttpWatcher) {
          var eventName = 'network:http-' + rejection.status;
          var storeRequest = defaultSave[rejection.status] || false;

          if (typeof rejection.config.saveOnHttpError !== 'undefined') {
            storeRequest = rejection.config.saveOnHttpError;
          }

          switch (rejection.status) {
            case 0:
            case 408:
              eventName = 'network:http-0';
              break;

            case 500:
            case 502:
            case 503:
            case 504:
              eventName = 'network:http-500';
              break;

            default:
              break;
          }

          $rootScope.$emit(eventName, rejection);

          if (storeRequest) {
            var retries = -1;
            if (angular.isDefined(rejection.config.headers['X-RETRIES'])) {
              retries = rejection.config.headers['X-RETRIES'];
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
