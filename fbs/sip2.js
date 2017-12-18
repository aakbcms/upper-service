/**
 * @file
 * Handles communication with FBS through SIP2.
 */

'use strict';

var Request = require('./request.js');

/**
 * Default constructor.
 *
 * @param config
 *   The FBS configuration.
 *
 * @constructor
 */
var SIP2 = function SIP2(config) {
  this.config = config;
};

/**
 * Send status message to FBS.
 *
 * @return {*}
 *   Promise tha resolved with response ID and rejects with the http error.
 */
SIP2.prototype.libraryStatus = function libraryStatus() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var req = new Request(self.config);
    req.libraryStatus(function (err, response) {
      if (err) {
        reject(err);
      }
      else {
        resolve(response.id);
      }
    });
  });
};

module.exports = SIP2;
