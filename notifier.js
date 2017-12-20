
var schedule = require('node-schedule');
var Status = require('./status');
var config = require('./config.json');
var debug = require('debug')('upper:notifier');

var Slack = require('slack-node');
slack = new Slack();
slack.setWebhook(config.notification.webhook);

/**
 * Post message to slack.
 *
 * @param message
 */
function postMessage(message) {
  slack.webhook({
    channel: config.notification.channel,
    username: "friendly-bot",
    text: message
  }, function(err, response) {
    debug(response);
  });
}

var j = schedule.scheduleJob(config.notification.interval, function(){
  var status = new Status();

  // Check FBS API.
  status.testConnections(config.API.url).then(function (connection) {
    return status.testFBS(config.API.config, 'login').then(function (login) {
      return status.testFBS(config.API.config, 'authenticate').then(function (authenticate) {
        var total = parseInt(connection.time + login.time + authenticate.time);
        if (total > config.API.limit) {
          postMessage('<@gitte.barlach> FBS API is slowing down - ' + total + 'ms');
        }
      });
    });
  }).catch(function (e) {
    var message = typeof e === 'string' ? e : e.message;
    postMessage('<@gitte.barlach> Error in connecting with FBS API - ' + message);
  });

  // Check FBS sip2.
  status.testConnections(config.SIP2.url).then(function (connection) {
    return status.testFBS(config.SIP2.config, 'sip2').then(function(sip2) {
      var total = parseInt(connection.time + sip2.time);
      if (total > config.API.limit) {
        postMessage('<@gitte.barlach> FBS SIP2 is slowing down - ' + total + 'ms');
      }
    })
  }).catch(function (e) {
    var message = typeof e === 'string' ? e : e.message;
    postMessage('<@gitte.barlach> Error in connecting with FBS SIP2 - ' + message);
  });

  // Check OpenSearch.
  status.testConnections(config.OpenSearch.url).then(function (connection) {
    return status.testOpenSearch(config.OpenSearch.config).then(function (opensearch) {
      var total = parseInt(connection.time + opensearch.time);
      if (total > config.API.limit) {
        postMessage('<@gitte.barlach> OpenSearch is slowing down - ' + total + 'ms');
      }
    })
  }).catch(function (e) {
    var message = typeof e === 'string' ? e : e.message;
    postMessage('<@gitte.barlach> Error in connecting with OpenSearch - ' + message);
  });
});
