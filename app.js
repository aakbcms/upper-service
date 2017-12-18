
var config = require('./config.json');
var debug = require('debug')('upper:main');

var Network = require('./network');

for (var i in config.endpoints) {
	var endpoint = config.endpoints[i];

	var networlTester = new Network(endpoint.url);
  networlTester.isOnline().bind(config.endpoints[i])
	.then(function() {
	   debug('Service is online: ' + this.url);

	   for (var j in this.tests) {
	     var test = this.tests[j];
       switch (test.type) {
         case "sip2":
           var SIP2 = require('./fbs/sip2');
           var sip2 = new SIP2(test.config);
           sip2.libraryStatus().then(function(response) {
             debug(response);
           }).catch(function(e) {
             debug(e);
           });

           break;

         case "fbs":
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
           var OpenSearch = require('./opensearch/opensearch');
           var client = new OpenSearch(test.config);
           client.search().then(function (time) {
             debug(time);
           }).catch(function(e) {
             debug(e);
           });
           break;

         default:
           console.log('request');
           break;
       }
     }
	})
	.catch(function(e) {
    console.log(this);
		debug(e);
		console.log('NO');
	});
}
