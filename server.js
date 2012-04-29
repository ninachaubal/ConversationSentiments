
//user
var usr = require('./user');
//colors
var col = require('./colors');
//http object
var http = require('http');
//create a server
var express = require('express');
var app = express.createServer();
//array of users - we support at most 4 users at a time
var table = [new usr.User(),new usr.User(),new usr.User(),new usr.User()];
//chat stream
var chat = [];
var chatIndex = 0;
var chatMax = 1000;

//sentiment output stream
var sentiment = [];
var sentimentIndex = 0;
var sentimentMax = 5000;

//circles
var circles = [];

var inUse = false;

/*
deliver index.html
*/
app.use(express.static(__dirname + '/chat'));

/*
deliver test.html
*/
app.use('/test', express.static(__dirname + '/test'));

/*
GET /table 
returns the current list of users on the table
example output - 
[{"name":"user1","color":"#11AFBA","position":"0"},
 {"name":"user2","color":"#A82A2A","position":"1"}, ...]
*/
app.get('/table', function(req, res){
    var arr = [];
    for(var i in table){
        var obj = table[i].getData();
        if(obj !== null){
            if(obj.position < 0){
                obj.position = i;
            }
            arr.push(obj);
        } 
    }
    res.json(arr,200);
});

/*
GET /stream
params:
last = the last index that was recieved from previous calls.
if this is the first call, call with negative last
returns the chat stream
example output - 
[{"name":"user1", "color":"#11AFBA","text":"Hi","index":"10","pos":"1"},
{"name":"user2", "color":"#A82A2A","text":"ssup?","index":"11","pos":"4"},
{"name":"user1", "color":"#11AFBA","text":"nm","index":"12","pos":"1"}]
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
GET /sentiments
params:
last = the last index that was recieved from previous calls.
if this is the first call, call with negative last
returns the sentiment stream
example output -
[{"pos":"4","color":["#0D3233", ... ], "text":"keyword","index"="4"},{...}]

here the sentiment data is already added to the color
*/
app.get('/sentiments', function(req, res){
    var last = req.param('last');
    var arr = [];
    for(var i in sentiment){
        if(sentiment[i].index > last){
            arr.push(sentiment[i]);
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
    var name = req.param('name');
    var theme = req.param('theme');
    var pos = req.param('pos');
    if(pos != undefined && pos >= 0 && pos <= 3 &&
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
*/
app.post('/chat', function(req, res){
    var pos = req.param('pos');
    var text = req.param('text');
    if(pos !== undefined && pos >= 0 && pos <=3 &&
       text !== undefined && text.length > 0){
        addChatLine(text,pos);
        addSentiment(text,pos);
    }
    res.send('',200);
});

/*
POST /circles
params:
arr = [{'x':3,y:'4',r:'5',c:'a'}, ...]
*/
app.post('/circles', function(req,res){
    var arr = req.param('req');
    if(arr !== undefined){
        circles = JSON.parse(arr);
        res.send('',200);
    }
});

/*
GET /circles
*/
app.get('/circles', function(req, res){
    res.json(circles,200);
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
GET debug
*/
app.get('/debug',function(rew,res){
    console.log(sentiment);
    res.send('',200);
});

/*
adds keywords to the sentiment stream
*/
function addSentiment(text, pos){
    if(sentiment.length == sentimentMax){
        sentiment.pop();
    }
    getSentiments(text, function(keywords){
        for (var i in keywords){
            var obj = {
                "pos" : pos,
                "color" : [],
                "text" : keywords[i].text,
                "index" : sentimentIndex
            };
            for(var j = 0 ; j < keywords[i].text.length; j++ ){
                var color = getSentimentColor(col.theme.getColor(table[pos].theme),
                                              keywords[i].sentiment);
                obj.color.push(color);
            }
            
            sentimentIndex++;
            sentiment.push(obj);
        }
    });
}

/*
adds text to the chat stream
*/
function addChatLine(text, pos){
    if(chat.length == chatMax){
        chat.pop();
    }
    var obj = {
        "pos" : pos,
        "color" : table[pos].color,
        "text" : text,
        "index" : chatIndex,
        "name" : table[pos].name
    };
    chatIndex++;
    chat.push(obj);
}

/*
calls alchemy api to extract keywords and sentiment scores from the text
*/
function getSentiments(text,callback){
    var apikey = '9cc8b1c546c26a53ee13d49d7c91acaeb5eea3ce';
    var alchemy = {
        host: 'access.alchemyapi.com',
        path: '/calls/text/TextGetRankedKeywords?apikey='+ apikey +
              '&outputMode=json&maxRetrieve=5&keywordExtractMode=strict' + 
            '&sentiment=1&text=' + encodeURIComponent(text)
    };

    http.get(alchemy, function(res){
        var data = "";
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function(){
            var dataobj = JSON.parse(data);
            var keywords = [];
            for(var i in dataobj.keywords){
                var t = dataobj.keywords[i].text;
                var s = 0;
                if(dataobj.keywords[i].sentiment.type != 'neutral'){
                    s = dataobj.keywords[i].sentiment.score;
                }
                keywords.push({
                    "text": t,
                    "sentiment" : s
                });
            }
            callback(keywords);
        });
    });
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
    hsv[2] = Math.round(score*50);
    
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
    for(var i in table){
        table[i].leave();
    }
    //reset chat
    chat = [];
    chatIndex = 0;
    //reset  sentiment
    sentiment = [];
    sentimentIndex = 0;
}

app.listen(process.env.PORT);
