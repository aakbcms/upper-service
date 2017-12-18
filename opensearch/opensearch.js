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
    soap.createClient(self.config.wsdl, function(err, client) {
      if (err) {
        reject(err);
      }
      else {
        client.search(self.config, function (err, result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(result.result.statInfo.time);
          }
        });
      }
    });
  });
};

module.exports = OpenSearch;