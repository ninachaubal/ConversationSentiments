
//colors
var col = require('./colors');
//Sentimental
var sentimental = require('Sentimental');
//create a server
var express = require('express');
var app = express();
//array of users
var users = [];

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
color is the base color of this user
example output - 
[{"name":"user1","color":"#11AFBA"},
 {"name":"user2","color":"#A82A2A"}, ...]
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
[{"name":"user1", "color":"#11AFBA","text":"Hi","index":"10",
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
theme = the color theme for the user 
pos = the position of the user (see position in User.join)
*/
app.post('/user', function(req, res){
    //TODO: change this
    var name = req.param('name');
    var theme = req.param('theme');
    var pos = req.param('pos');
    if(pos !== undefined && pos >= 0 && pos <= 3 &&
       theme !== undefined && theme > 0 && theme <= 4 &&
       name !== undefined && name.length > 0){
        inUse = true;
        table[pos].join(theme, name, pos);
        res.send('',200);
    }
});

/*
DELETE /user
params:
pos = position of the user
*/
app.del('/user',function(req,res){
    // TODO: change this
    var pos = req.param('pos');
    if(pos != undefined && pos >= 0 && pos <= 3){
        table[pos].leave();
        inUse = false;
        for(var i in table){
            if(table[i].isConversing){
                inUse = true;
                break;
            }
        }
        if(!inUse){
            reset();
        }
    }
    res.send('',200);
});

/*
POST /chat
params:
pos = the position of the user
text = the stuff the user said
amp = amplitude (0-8. defaults to 4)
*/
app.post('/chat', function(req, res){
    //TODO: change this
    var pos = req.param('pos');
    var text = req.param('text');
    var amp = req.param('amp');
    if(pos !== undefined && pos >= 0 && pos <=3 &&
       text !== undefined && text.length > 0){
        if (amp === undefined) {
            amp = 4;
        }
        addChatLine(text,pos, amp);
    }
    res.send('',200);
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
function addChatLine(text, pos, amp){
    //TODO: change this
    if(chat.length == chatMax){
        chat.pop();
    }
    var obj = {
        "pos" : pos,
        "color" : table[pos].color,
        "text" : text,
        "index" : chatIndex,
        "name" : table[pos].name,
        "time" : String(Math.round(new Date().getTime() / 1000))
    };
}

/*
takes a #rrbbgg color string, adjusts value in hsv space as per the score
which is in a [-1,1] range
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
