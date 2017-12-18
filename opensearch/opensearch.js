
var soap = require('soap');

var OpenSearch = function OpenSearch(config) {
  this.config = config;
};

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