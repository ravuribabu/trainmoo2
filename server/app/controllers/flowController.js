process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./flowPersister.js')('tmp');
var app = express();

module.exports = function(router) {

  // Configure access control allow origin header stuff
  var ACCESS_CONTROLL_ALLOW_ORIGIN = false;


  // Handle uploads through Flow.js
  router.post('/img/upload', multipartMiddleware, function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {
      if (status === 'done') {
        process.nextTick(function() { flow.createThumbnail(req); } );
      }
      //console.log('POST', status, original_filename, identifier);
      if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
      }
      res.status(status).send();

    });
  });
  router.options('/img/upload', function(req, res){
    //console.log('OPTIONS');
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(200).send();
  });

  // Handle status checks on chunks through Flow.js
  router.get('/img/upload', function(req, res) {
    flow.get(req, function(status, filename, original_filename, identifier) {
      //console.log('GET', status);
      if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
      }

      if (status == 'found') {
        status = 200;
      } else {
        status = 204;
      }

      res.status(status).send();
    });
  });

  router.get('/img/download/:identifier', function(req, res) {
    console.log('DOWNLOADING Image' + req.params.identifier);
    flow.write(req.params.identifier, res);
  });

  router.get('/img/download/thumbnail/:identifier', function(req, res) {
    console.log('DOWNLOADING Image' + req.params.identifier);
    flow.writeThumbnail(req.params.identifier, res);
  });

  router.delete('/img/:identifier', function(req, res) {
    console.log('Deleting Image' + req.params.identifier);
    flow.clean(req.params.identifier);
  });

}