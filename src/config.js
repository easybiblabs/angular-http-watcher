module.exports = function() {
  var config = {
    eventName: 'network:http-error',
    status: {
      0: true,
      408: true,
      401: true
    }
  };

  this.getConfig = function() {
    return config;
  };

  this.setConfig = function(userConfig) {
    angular.extend(config, userConfig);
  };

  this.$get = function() {
    return this;
  }
};
