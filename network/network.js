
/**
 * @file
 * Checks if the application has online connection.
 */

'use strict';

var url = require('url');
var fork = require('child_process').fork;

var debug = require('debug')('upper:network');

/**
 * The network object.
 *
 * @constructor
 */
var Network = function Network(url, timeout = 1000, port = null) {
  this.url = url;
  this.port = port;
  this.timeout = timeout;
};

/**
 * Check if a given URI address is online.
 *
 * @returns {*}
 *   Promise resolves if the URI is online else rejected.
 */
Network.prototype.isOnline = function isOnline() {
  var self = this;

  return new Promise(function(resolve, reject) {
    try {
      var address = url.parse(self.url);
      var port = (self.port ==! null ? self.port : (address.protocol === 'https:' ? 443 : 80));

      var hrstart = process.hrtime();
      var tester = fork(__dirname + '/network_tester.js', [address.host, port, self.timeout]);

      tester.once('message', function (data) {
        if (data.error) {
          debug('Tester error: ' + data.message);
          reject({
            'message': data.message,
            'uri': self.url,
            'host': address.protocol + '//' + address.host
          });
        }
        else {
          var hrend = process.hrtime(hrstart);
          debug('Tester connected successful (pid: ' + tester.pid + ')');
          resolve({
            'uri': self.url,
            'time': Math.round(hrend[1]/1000000),
            'host': address.protocol + '//' + address.host
          });
        }
      });

      // Debug helper code.
      tester.once('close', function (code) {
        debug('Tester (pid: ' + tester.pid + ') closed with code: ' + code);
      });

      debug('Tester started with pid: ', tester.pid);
    }
    catch (err) {
      reject({
        'message': err,
        'uri': self.url
      });
    }
  });
};

module.exports = Network;
