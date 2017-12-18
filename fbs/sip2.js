/**
 * @file
 * Handles communication with FBS through SIP2.
 */

'use strict';

var util = require('util');
var eventEmitter = require('events').EventEmitter;

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

// Extend the object with event emitter.
util.inherits(SIP2, eventEmitter);

/**
 * Send status message to FBS.
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
        resolve(response);
      }
    });
  });
};

module.exports = SIP2;
