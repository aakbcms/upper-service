/**
 * @file
 * Handles communication with FBS through SIP2.
 */

'use strict';

var request = require('request-json');

var FBS = function FBS(config) {
  this.config = config;

  this.client = request.createClient(config.endpoint);
};

/**
 * Send status message to FBS.
 */
FBS.prototype.login = function login() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var uri = self.config.login.uri;
    var data = JSON.parse(JSON.stringify(self.config.login));
    delete data.uri;
    self.client.post(uri, data, function(err, res, body) {
      if (err) {
        reject(err);
      }
      else {
        self.client.headers['X-Session'] = body.sessionKey;
        resolve(res.statusCode);
      }
    });
  });
};

FBS.prototype.authenticate = function authenticate() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var uri = self.config.authenticate.uri;
    var data = JSON.parse(JSON.stringify(self.config.authenticate));
    delete data.uri;
    self.client.post(uri, data, function(err, res, body) {
      if (err) {
        reject(err);
      }
      else {
        resolve(res.statusCode);
      }
    });
  });
};


module.exports = FBS;
