/**
 * @file
 * Wrapper for the status checks.
 */

// Network check - used to check for simple socket connection for a given service.
var Network = require('./network/network');

var FBS = require('./fbs/fbs');
var fbsClient;

/**
 * Default constructor.

 * @constructor
 */
var Status = function Status() {};

/**
 * Test network connection.
 *
 * @param url
 *
 * @return {*}
 */
Status.prototype.testConnections = function testConnections(url) {
  var networkTester = new Network(url);
  return networkTester.isOnline();
};

/**
 * Test the status of the different FBS end points.
 *
 * @param config
 * @param type
 * @return {*}
 */
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

    case "preauthenticate":
      if (fbsClient === undefined) {
        fbsClient = new FBS(config);
      }
      return fbsClient.preauthenticate();

    default:
      console.error('Unknown test found in configuration: ' + type);
      break;
  }
};

/**
 * Test OpenSearch end point.
 *
 * @param config
 * @param type
 * @return {*}
 */
Status.prototype.testOpenSearch = function testOpenSearch(config, type) {
  var OpenSearch = require('./opensearch/opensearch');
  var client = new OpenSearch(config);
  return client.search();
};

module.exports = Status;
