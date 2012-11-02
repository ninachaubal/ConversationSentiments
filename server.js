//create a server
var express = require('express');
var app = express();

// other required modules
var fs = require('fs');
var exec = require('child_process').exec;
var https = require('https');

/*
use multipart request bodies
*/
app.use(express.multipart());

/*
parse request bodies.
*/
app.use(function(req, res, next) {
  var data = '';
  req.setEncoding('binary');
  req.on('data', function(chunk) { 
    data += chunk;
  });

  req.on('end', function() {
    req.body.audio = data;
    next();
  });
});

/*
mount static content at /
*/
app.use(express.static(__dirname + '/static'));

/*
Set headers for cross site requests
*/
app.get('/*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.post('/*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

//============================================================================//
var requests = {}

/*
  GET /token
  returns a unique token
*/
app.get('/token', function(req, res){
  var token = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i < 6; i++) {
    token += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  requests[token] = 'reserved'      
  res.json({token: token});
});

/*
  POST /audio
  param: 
    token: a unique identifier for this recording
*/
app.post('/audio', function(req, res){
  var rec = req.param('token');
  if (requests[token] !== undefined) {
    // write .wav file to tmp
    var filepath = __dirname + '/tmp/' + token + '.wav';
    var fd = fs.openSync(filepath, 'a');
    var buff = new Buffer(req.body.audio, 'binary');
    fs.writeSync(fd, buff, 0, buff.length, 0);
    fs.closeSync(fd);
    // convert to flac
    var child = exec('flac -0 ' + token + '.wav', 
      function(err) {
        if (err == null) {
          var post_data = 'TODO' //TODO
          var post_options = {
            host: 'google.com',
            path: '/speech-api/v1/recognize?client=chromium&lang=en-US&pfilter=0',
            method: 'POST',
            headers: {
              'Content-Type': 'audio/x-flac; rate=22050',
              'Content-Length': post_data.length
            }
          };
          var textresponse = '';
          var post_req = https.request(post_options, function(res) {
            res.setEncoding('utf*')
            res.on('data'. function(chunk) {
              textresponse += chunk;
            });
          });
          post_req.write(post_data);
          post_req.end();
        }
      });
  }
});

/*
  GET /text
  param: 
    rec: unique identifier passed to /audio
*/
app.get('/text', function(req, res){
  var rec = req.param('rec');
});

if (process.env.PORT !== undefined) {
  app.listen(process.env.PORT);
} else {
  app.listen(8080);
}
