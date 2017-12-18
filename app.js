var Network = require('./network');

var test = new Network('https://google.dk');

test.isOnline().then(function(v) {
   console.log('YES');
})
.catch(function(e) {
	console.log(e);
	console.log('NO');
});
