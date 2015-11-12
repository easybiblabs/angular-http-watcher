/**
 * This module uses lots of inspiration and code from
 * the http auth interceptor module by Witold Szczerba.
 * https://github.com/witoldsz/angular-http-auth
 *
 * Modified to work globally as an http request watcher
 */

(function() {
  'use strict';

  angular.module('http-watch-buffer', [])
    .factory('httpBuffer', require('./buffer'));

  angular.module('http-watch', ['http-watch-buffer'])
    .factory('httpWatcher', require('./watcher'))
    .config(require('./interceptor'));

})();
