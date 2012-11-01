//create a server
var express = require('express');
var app = express();
var fs = require('fs');

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

/*
  POST /audio
  param: 
    rec: a unique identifier for this recording
*/
app.post('/audio', function(req, res){
  var rec = req.param('rec');
  var filepath = __dirname + '/tmp/' + Date.now() + '-' + rec + '.wav';
  var fd = fs.openSync(filepath, 'a');
  var buff = new Buffer(req.body.audio, 'binary');
  fs.writeSync(fd, buff, 0, buff.length, 0);
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
