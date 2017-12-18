/**
 * @file
 * Handles communication with FBS through CMS rest API.
 */

'use strict';

var request = require('request-json');

/**
 * Default constructor.
 *
 * @param {object} config
 *   Configuration object from the config.json. For more information see example.config.json file.
 *
 * @constructor
 */
var FBS = function FBS(config) {
  this.config = config;
  this.client = request.createClient(config.endpoint, {
    time : true
  });
};

/**
 * Login to FBS.
 *
 * This will give us a session key for further communication with the API.
 *
 * @return {*}
 *   Promise tha resolved with HTTP statusCode and request time. Rejects with the http error.
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
        resolve({
          'statusCode': res.statusCode,
          'time': res.elapsedTime
        });
      }
    });
  });
};

/**
 * Authenticate a library with FBS.
 *
 * @return {*}
 *   Promise tha resolved with HTTP statusCode and request time. Rejects with the http error.
 */
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
        resolve({
          'statusCode': res.statusCode,
          'time': res.elapsedTime
        });
      }
    });
  });
};

module.exports = FBS;
