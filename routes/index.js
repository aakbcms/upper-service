var express = require('express');
var router = express.Router();

var Status = require('./../status');
var config = require('./../config.json');
var debug = require('debug')('upper:index');

/**
 * Render status section for FBS CMS API end point.
 *
 * @param res
 * @return {*}
 */
function renderFBSStatus(res) {
  var status = new Status();

  return new Promise(function(resolve, reject) {
    status.testConnections(config.API.url).then(function (connection) {
      return status.testFBS(config.API.config, 'login').then(function (login) {
        return status.testFBS(config.API.config, 'authenticate').then(function (authenticate) {
          return status.testFBS(config.API.config, 'preauthenticate').then(function (preauthenticate) {
            var total = parseInt(connection.time + login.time + authenticate.time + preauthenticate.time);
            var data = {
              title: 'FBS API Connection',
              total: total,
              status: total < config.API.limit ? 'success' : 'warning',
              items: [{
                'type': 'Socket',
                'uri': connection.host,
                'time': connection.time
              }, {
                'type': 'Login',
                'uri': login.uri,
                'time': login.time
              }, {
                'type': 'User authentication',
                'uri': authenticate.uri,
                'time': authenticate.time,
                'error': !authenticate.authenticated
              }, {
                'type': 'User pre-authentication',
                'uri': preauthenticate.uri,
                'time': preauthenticate.time,
                'error' : !preauthenticate.authenticated
              }]
            };
            debug(data);

            res.render('status', data, function (err, html) {
              resolve(html);
            });
          });
        });
      });
    }).catch(function (e) {
      var data = {
        title: 'FBS Connection',
        status: 'danger',
        error: e
      };
      res.render('status', data, function (err, html) {
        resolve(html);
      });
    });
  });
}

/**
 * Render status for FBS sip2 end point.
 *
 * @param res
 * @return {*}
 */
function renderSIP2Status(res) {
  var status = new Status();

  return new Promise(function(resolve, reject) {
    status.testConnections(config.SIP2.url).then(function (connection) {
      return status.testFBS(config.SIP2.config, 'sip2').then(function(sip2) {
        var total = parseInt(connection.time + sip2.time);
        var data = {
          title: 'FBS SIP2 Connection',
          total: total,
          status: total < config.SIP2.limit ? 'success' : 'warning',
          items: [{
            'type': 'Socket',
            'uri': connection.host,
            'time': connection.time
          }, {
            'type': 'SIP2',
            'uri': sip2.uri,
            'time': sip2.time
          }]
        };
        debug(data);

        res.render('status', data, function (err, html) {
          resolve(html);
        });
      })
    }).catch(function (e) {
      var data = {
        title: 'FBS SIP2 Connection',
        status: 'danger',
        error: e
      };
      res.render('status', data, function (err, html) {
        resolve(html);
      });
    });
  });
}

/**
 * Render status for OpenSearch.
 *
 * @param res
 * @return {*}
 */
function renderOpenSearchStatus(res) {
  var status = new Status();

  return new Promise(function (resolve, reject) {
    status.testConnections(config.OpenSearch.url).then(function (connection) {
      return status.testOpenSearch(config.OpenSearch.config).then(function (opensearch) {
        var total = parseInt(connection.time + opensearch.time);
        var data = {
          title: 'OpenSearch',
          total: total,
          status: total < config.OpenSearch.limit ? 'success' : 'warning',
          items: [{
            'type': 'Socket',
            'uri': connection.host,
            'time': connection.time
          }, {
            'type': 'OpenSearch',
            'uri': opensearch.uri,
            'time': '(' + opensearch.timeOpenSearch + 's) ' + opensearch.time,
            'error': opensearch.error
          }]
        };
        debug(data);

        res.render('status', data, function (err, html) {
          resolve(html);
        });
      })
    }).catch(function (e) {
      var data = {
        title: 'OpenSearch',
        status: 'danger',
        error: e
      };
      res.render('status', data, function (err, html) {
        resolve(html);
      });
    });
  });
}

/**
 * Return the route content.
 */
router.get('/', function(req, res, next) {
  var renders = [
    renderFBSStatus(res),
    renderSIP2Status(res),
    renderOpenSearchStatus(res)
  ];

  Promise.all(renders).then(function (content) {
    res.render('index', { title: 'Upper service', content: content.join('') });
  }).catch(function (e) {
    console.log(e);
  });
});


module.exports = router;
