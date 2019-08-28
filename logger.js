/**
 * Notifier applicaton the post connectivity issues to slack.
 */
var schedule = require('node-schedule');
var Status = require('./status');

var config = require('./config.json');
var debug = require('debug')('upper:logger');

var Influx = require('influx');

/**
 * Post message to slack.
 *
 * @param db
 * @param type
 * @param connection
 * @param time_used
 */
function write(db, type, connection, time_used) {
  let dataPoint = [{
    measurement: type,
    fields: { 
      "connection": connection,
      "time_used": time_used
    }
  }];

  db.writePoints(dataPoint)
    .catch(function err(err) {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
  });
}

var db = new Influx.InfluxDB(config.logger.influx);
db.getDatabaseNames()
  .then(function (names) {
    if (!names.includes(config.logger.influx.database)) {
      return db.createDatabase(config.logger.influx.database);
    }
  })
  .then(function () {
    debug('READY');

    // Start the scheduler.
    var j = schedule.scheduleJob(config.notification.interval, function() {
      var status = new Status();

      // Check FBS API.
      status.testConnections(config.API.url).then(function (connection) {
        return status.testFBS(config.API.config, 'login').then(function (login) {
          return status.testFBS(config.API.config, 'authenticate').then(function (authenticate) {
            return status.testFBS(config.API.config, 'preauthenticate').then(function (preauthenticate) {
              var time_used = parseInt(connection.time) + parseInt(login.time) + parseInt(authenticate.time) + parseInt(preauthenticate.time);
              write(db, 'FBS_API', parseInt(connection.time), time_used);
              write(db, 'FBS_API_LOGIN', parseInt(connection.time), parseInt(login.time));
              write(db, 'FBS_API_AUTH', parseInt(connection.time), parseInt(authenticate.time));
              write(db, 'FBS_API_PREAUTH', parseInt(connection.time), parseInt(preauthenticate.time));
            });
          });
        }); 
      }).catch(function (e) {
        write(db, 'FBS_API', 0, 0)
      });

      // Check FBS sip2.
      status.testConnections(config.SIP2.url).then(function (connection) {
        return status.testFBS(config.SIP2.config, 'sip2').then(function(sip2) {
          var time_used = parseInt(connection.time) + parseInt(sip2.time);
          write(db, 'FBS_SIP2', parseInt(connection.time), time_used);
        })
      }).catch(function (e) {
        write(db, 'FBS_SIP2', 0, 0)
      });

      // Check OpenSearch.
      status.testConnections(config.OpenSearch.url).then(function (connection) {
        return status.testOpenSearch(config.OpenSearch.config).then(function (opensearch) {
          var time_used = parseInt(connection.time) + parseInt(opensearch.time);
          write(db, 'OpenSearch', parseInt(connection.time), time_used);
        })
      }).catch(function (e) {
        write(db, 'OpenSearch', 0, 0);
      });
    });
  })
  .catch(function (err) {
    console.error(`Error creating Influx database: ${err.stack}`);
  });

