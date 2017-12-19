/**
 * @file
 * Wrapper for the status checks.
 */

var debug = require('debug')('upper:status');

// Network check - used to check for simple socket connection for a given service.
var Network = require('./network/network');

var FBS = require('./fbs/fbs');
var fbsClient;

/**
 * Default constructor.

 * @constructor
 */
var Status = function Status() {};

Status.prototype.testConnections = function testConnections(url) {
  var networkTester = new Network(url);
  return networkTester.isOnline();
};

Status.prototype.testFBS = function testFBS(config, type) {
  // Switch of the different types of tests.
  switch (type) {
    case "sip2":
      // SIP2 protocol test - simple 99 request to FBS.
      var SIP2 = require('./fbs/sip2');
      var sip2 = new SIP2(config);
      return sip2.libraryStatus();

    case "login":
      fbsClient = new FBS(config);
      return fbsClient.login();

    case "authenticate":
      if (fbsClient === undefined) {
        fbsClient = new FBS(config);
      }
      return fbsClient.authenticate();

    default:
      console.error('Unknown test found in configuration: ' + type);
      break;
  }
};

Status.prototype.testOpenSearch = function testOpenSearch(config, type) {
  var OpenSearch = require('./opensearch/opensearch');
  var client = new OpenSearch(config);
  return client.search();
};

module.exports = Status;
