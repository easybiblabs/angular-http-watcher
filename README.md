# imagineasy-angular-http-watcher

HTTP Watcher Module
============================

This is initially based on the concept described in [Authentication in AngularJS (or similar) based application](http://www.espeo.pl/1-authentication-in-angularjs-application/) and  - https://github.com/witoldsz/angular-http-auth

But we extended it to be a general notification (and buffering) system for all http requests an angular app does via the `$http` service.

Usage
------

- Install via npm: `npm install --save imagineeasy-angular-http-watcher`
- Include as a dependency in your app: `angular.module('myApp', ['http-watch'])`

Manual
------

This module installs $http interceptor and provides the `httpWatcher` module.

The $http interceptor does the following:

If an HTTP request fails, the event `network:http-error` is broadcasted with the configuration object (this is the requested URL, payload and parameters)
of said request. If the HTTP Error-Code is either `0` or `401` it is buffered and can be replayed at any given time using the `continue()` method of the `httpWatcher` module.

You are responsible to invoke this method after you handled the error. Example:
```js
/** @ngInject */
return function(httpWatcher) {
    httpWatcher.continue();
};
```


#### Ignoring the interceptor

Sometimes you might not want the interceptor to intercept a request even if one returns a http error code. In a case like this you can add `ignoreHttpWatcher: true` to the request config.

#### Disabling the buffering of requests

If needed, you can also add `saveOnHttpError: false|true` to the request config to specifically say you want to allow/disallow buffering a request regardless of the response code.

#### Specifing maximum retries of a http request

You can also limit the number of retries of an HTTP Requests before it gets automatically rejected. By default there is no limit. Setting `maxRetries: 10` will limit retries to 10 times.
