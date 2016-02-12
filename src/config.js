module.exports = function() {
  var config = {
    eventNames: {
      error: 'network:http-error',
      continue: 'network:continue',
      reject: 'network:reject'
    },
    status: {}
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
