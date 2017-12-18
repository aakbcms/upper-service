/**
 * @file
 * Main application file.
 *
 * This application check's the different services required by DDB CMS base on the checks defined in the configuration
 * file.
 */

var config = require('./config.json');
var debug = require('debug')('upper:main');

// Network check - used to check for simple socket connection for a given service.
var Network = require('./network/network');

// Loop over the endpoints in the config file.
for (var i in config.endpoints) {
	var endpoint = config.endpoints[i];

	var networlTester = new Network(endpoint.url);
  networlTester.isOnline()
  .bind(endpoint)
	.then(function() {
	   debug('Service is online: ' + this.url);

	   for (var j in this.tests) {
	     var test = this.tests[j];

	     // Switch of the different types of tests.
       switch (test.type) {
         case "sip2":
           // SIP2 protocol test - simple 99 request to FBS.
           var SIP2 = require('./fbs/sip2');
           var sip2 = new SIP2(test.config);
           sip2.libraryStatus().then(function(response) {
             debug(response);
           }).catch(function(e) {
             debug(e);
           });
           break;

         case "fbs":
           // Test FBS CMS api with a login request and then an authentication request for a test user.
           var FBS = require('./fbs/fbs');
           var fbs = new FBS(test.config);
           fbs.login().then(function(response) {
             if (parseInt(response) === 200) {
               fbs.authenticate().then(function(response) {
                 debug(response);
               }).catch(function(e) {
                 debug(e);
               });
             }
             else {
               console.log('NO');
             }
           }).catch(function(e) {
             debug(e);
           });
           break;

         case 'opensearch':
           // Connect to OpenSearch and send search request.
           var OpenSearch = require('./opensearch/opensearch');
           var client = new OpenSearch(test.config);
           client.search().then(function (time) {
             debug(time);
           }).catch(function(e) {
             debug(e);
           });
           break;

         default:
           console.error('Unknown test found in configuration: ' + test.type);
           break;
       }
     }
	})
	.catch(function(e) {
	  // Socket connection test error - network tester.
	  debug(e);
		console.log('NO');
	});
}
