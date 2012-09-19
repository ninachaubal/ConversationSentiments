//colors
var col = require('./colors');
var colors = col.colors();
//Sentimental
var analyze = require('sentimental').analyze;
//create a server
var express = require('express');
var app = express();

//array users
var users = [];
//id to be issued to next user 
var nextId = 0;

//chat stream
var chat = [];
var chatIndex = 0;
var chatMax = 5000;

/*
deliver index.html
*/
app.use(express.static(__dirname + '/chat'));

/*
deliver test.html
*/
app.use('/test', express.static(__dirname + '/test'));

/*
GET /users
returns the current list of users 
example output - 
[{"name":"user1","color":"#11AFBA"},
 {"name":"user2","color":"#A82A2A"}, ...]

color is the base color of the user
index in the array is the id
users who have left the conversation will be undefined
*/
app.get('/users', function(req, res){
    res.json(users,200);
});

/*
GET /stream
params:
last = the last index that was recieved from previous calls.
if this is the first call, call with negative last
returns the chat stream
example output - 
[{"name":"user1", "id":1, "color":"#11AFBA","text":"Hi","index":"10",
  "time":"1256953732", "sentiment":{...}}, ...]

the sentiment object is as returned by Sentimental.analyze()
the color is adjusted as per the average sentiment
*/
app.get('/stream', function(req, res){
    var last = req.param('last');
    var arr = [];
    for(var i in chat){
        if(chat[i].index > last){
            arr.push(chat[i]);
        }
    }
    res.json(arr,200);
});

/*
POST /user
params:
name = the user name of the user to add
returns a unique id for this user;
example output
{"id":1}
*/
app.post('/user', function(req, res){
    var name = req.param('name');
    if(name !== undefined && name.length > 0){
        var color = colors.getColor();
        users[nextId] = {"name": name, "color": color};
        var ret = {"id": nextId};
        nextId++;
        res.json(ret, 200);
    }
    res.send('',400);
});

/*
DELETE /user
params:
id = id of the user
*/
app.del('/user',function(req,res){
    var id = req.param('id');
    if(id != undefined && id >= 0 && id < nextId){
        users[id] = undefined;
        res.send('',200);
    }
    res.send('',400);
});

/*
POST /chat
params:
id = the id of the user
text = the stuff the user said
amp = amplitude (0-8. defaults to 4)
*/
app.post('/chat', function(req, res){
    var id = req.param('id');
    var text = req.param('text');
    var amp = req.param('amp');
    if(id !== undefined && id >= 0 && id < nextId && users[id] !== undefined &&
       text !== undefined && text.length > 0){
        if (amp === undefined) {
            amp = 4;
        }
        addChatLine(text,id, amp);
        res.send('',200);
    }
    res.send('',400);
});

/*
GET /reset
forcibly resets the conversation
*/
app.get('/reset', function(req, res){
    reset();
    res.send('',200);
});

/*
adds text to the chat stream
returns the index where the last chat line was added
*/
function addChatLine(text, id, amp){
    if(chat.length == chatMax){
        chat.pop();
    }
    var sentiment = analyze(text);
    var obj = {
        "id" : id,
        "text" : text,
        "index" : chatIndex,
        "name" : users[id].name,
        "time" : String(Math.round(new Date().getTime() / 1000)),
        "sentiment": sentiment,
        "color" : getSentimentColor(users[id].color, sentiment.score)
    };
}

/*
takes a #rrbbgg color string, adjusts value in hsv space as per the score
which is in a [-5,5] range
and returns another color string
*/
function getSentimentColor(color, score){
    //get the color
    color = color.trim();

    var r = parseInt(color.substring(1,3),16);
    var g = parseInt(color.substring(3,5),16);
    var b = parseInt(color.substring(5,7),16);
    var hsv = col.rgbToHsv(r,g,b);
    //change the value (hsv[2])
    score /= 5; //score is now in [-1,1] range
    score += 1; //score is now in [0,2] range
    hsv[2] = Math.round(40 + score*30);
    var rgb = col.hsvToRgb(hsv[0],hsv[1],hsv[2]);
    var str = '#';
    for(var i in rgb){
        var temp = rgb[i].toString(16);
        if(temp.length == 1){
            temp = '0'+temp;
        }
        str+=temp;
    }
    return str;
}

/*
reset the conversation
*/
function reset(){
    //remove all users
    users = [];
    //reset chat
    chat = [];
    chatIndex = 0;
}

app.listen(process.env.PORT);
