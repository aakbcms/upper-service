/**
 * @file
 * OpenSearch request handler.
 */

var soap = require('soap');

/**
 * OpenSearch constructor.
 *
 * @param {object} config
 *   Configuration object from the config.json. For more information see example.config.json file.
 *
 * @constructor
 */
var OpenSearch = function OpenSearch(config) {
  this.config = config;
};

/**
 * Send search request to OpenSearch.
 *
 * @return {*}
 *   Promise that resolves with the time that the data well used or reject with error.
 */
OpenSearch.prototype.search = function search() {
  var self = this;

  return new Promise(function(resolve, reject) {
    var hrstart = process.hrtime();
    soap.createClient(self.config.wsdl, function(err, client) {
      if (err) {
        reject(err);
      }
      else {
        client.search(self.config, function (err, result) {
          var hrend = process.hrtime(hrstart);
          var time = Math.round(hrend[1]/1000000);
          if (err) {
            reject({
              'uri': self.config.wsdl,
              'time': time
            });
          }
          else {
            resolve({
              'uri': self.config.wsdl,
              'time': time,
              'timeOpenSearch': result.hasOwnProperty('statInfo') ? result.result.statInfo.time : 0,
              'error': result.hasOwnProperty('error')
            });
          }
        });
      }
    });
  });
};

module.exports = OpenSearch;
