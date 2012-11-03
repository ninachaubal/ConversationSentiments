//create a server
var express = require('express');
var app = express();

// other required modules
var fs = require('fs');
var exec = require('child_process').exec;
var request = require('request');

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
  var token = req.param('token');
  if (requests[token] == 'reserved') {
    // write .wav file to tmp
    var filepath = __dirname + '/tmp/' + token + '.wav';
    var fd = fs.openSync(filepath, 'a');
    var buff = new Buffer(req.body.audio, 'binary');
    fs.writeSync(fd, buff, 0, buff.length, 0);
    fs.closeSync(fd);
    // convert to flac
    var child = exec('flac -0 -f ' + __dirname + '/tmp/' + token + '.wav',
      function(err){
        if (err != null) {
          console.log(err);
        } else {
          var flac = fs.readFileSync(__dirname + '/tmp/' + token + '.flac');
          request({
            url: 'https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&lang=en-US',
            method: 'POST',
            headers: {
              'Content-Type': 'audio/x-flac; rate=22050'
            },
            body: flac
          }, function (err, res, body) {
            body = JSON.parse(body);
            console.log(body.hypotheses);
            if (body.hypotheses.length > 0) {
              console.log(body.hypothesis[0].utterance);
            } else {
              console.log('empty');
            }
          });
        }
      }
    );
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
