//colors
var colors = require('./colors').colors;

//Sentimental
var analyze = require('Sentimental').analyze;
//create a server
var express = require('express');
var app = express();
// test
var test = require('./test');

// Data Buffer
var dataBuffer = [];

// map of participants
var participants = {};

/*
mount static content at /
*/
app.use(express.static(__dirname + '/static'));

/*
parse request bodies
*/
app.use(express.bodyParser());

/*
POST /test
load test data
*/
app.post('/test', function(req, res){
  test.loadtestdata('testdata-friends.srt', addUser, addData);
  res.send(200);
});

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
POST /users
params:
users = [{id: id, name: name} ...]
where,
id = participant id as given by the hangouts api
name = participant's display name
*/
app.post('/users', function(req, res){
  var users = req.body.users;
  var success = false;
  for (var i in users) {
    success = success || addUser(users[i].id, users[i].name);
  }
  if (success) {
    res.send(200);
  } else {
    res.send(400);
  }
});

function addUser(id, name) {
  if (id !== undefined && name !== undefined && participants[id] === undefined){
    var h = colors.getColor(id);
    participants[id] = {'h': h, 's': 100, 'l': 50 ,'name': name};
    return true;
  } else {
    return false;
  }
}


/*
  GET /users
  returns all users currently in the conversation
*/
app.get('/users', function(req, res) {
  res.json(200, participants);
});

/*
  DELETE /user
  params:
  id = id given by gapi.hangout.getLocalParticipantId()
*/
app.del('/user', function(req, res) {
  var id = req.param('id');
  if (id !== undefined) {
    colors.remove(id);
    delete participants[id];
  } else {
    res.send(400);
  }
});

/*
  POST /data
  params:
  text: the text content of the message
  id: the id of the participants
  duration: duration in ms of the message
  amplitude: amplitude of the recording in a (0,10] range
  topic: current hangout topic
*/
app.post('/data', function(req, res){
  var id = req.param('id');
  var text = req.param('text');
  var duration = parseInt(req.param('duration'),10);
  var amplitude = parseInt(req.param('amplitude'),10);
  var topic = req.param('topic');
  res.send(addData(id, text, duration, amplitude, topic,
            new Date().getTime()));
});

function addData(id, text, duration, amplitude, topic, time) {
  if (id !== undefined && text !== undefined &&
      duration !== undefined && duration > 0 &&
      amplitude !== undefined && amplitude > 0 &&
      amplitude <= 10 && time !== undefined){
    var analysis = analyze(text);
    var dataObj = {
      'id': id,
      'text': text,
      'time': time,
      'duration': duration,
      'amplitude': amplitude,
      'topic': topic,
      'score' : analysis,
      'h' : participants[id].h,
      's' : participants[id].s,
      // converts [-5,5] sentiment score range to [20, 80] lightness values
      'l' : 20 + ((parseInt(analysis.score,10) + 5) * 6)
    };
    dataBuffer.push(dataObj);
    return 200;
  } else {
    return 400;
  }
};

/*
  GET /data
  returns dataBuffer
*/
app.get('/data', function(req, res) {
  res.json(200, dataBuffer);
});

/*
  GET /reset
  resets the server
*/
app.get('/reset', function(req, res){
  dataBuffer = [];
  participants = [];
  colors.reset();
});

/*
  GET /time
*/
app.get('/time', function(req, res) {
  res.json(200, {time: new Date().getTime()});
});

if (process.env.PORT !== undefined) {
  app.listen(process.env.PORT);
} else {
  app.listen(8080);
}
