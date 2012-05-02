
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

//sentiwordnet
var swn = false;

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
[{"name":"user1","color":"#11AFBA","position":"0","theme":1},
 {"name":"user2","color":"#A82A2A","position":"1","theme":3}, ...]
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
[{"name":"user1", "color":"#11AFBA","text":"Hi","index":"10","pos":"1","time":"1256953732"},
{"name":"user2", "color":"#A82A2A","text":"ssup?","index":"11","pos":"4","time":"1256958752"},
{"name":"user1", "color":"#11AFBA","text":"nm","index":"12","pos":"1","time":"1257958442"}]

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
GET /sentiments
params:
last = the last index that was recieved from previous calls.
if this is the first call, call with negative last
returns the sentiment stream
example output -
[{"pos":"4","color":["#0D3233", ... ], "text":"keyword","index"="4"},{...}]

the color is adjusted as per sentiment score for each keyword
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
    }
    res.send('',200);
});

/*
GET postcircles 
This is pretty much a terrible idea
params:
arr = [{'x':3,'y':4,'rad':5,'ang':'-1','chr':'a',col:'#2323ff'}, ...]
*/
app.get('/postcircles', function(req,res){
    var arr = req.param('arr');
    if(arr !== undefined){
        console.log(arr);
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
POST /swn
param:
val : true or false
false = use AlchemyAPI
true = use SentiWordNet
*/
app.post('/swn',function(req,res){
    var val = req.param('val');
    if(val !== undefined){
        swn = (val == 'true');
    }
});

/*
adds keywords to the sentiment stream
also adds chatObj to the chat stream after adjusting its color
*/
function addSentiment(text, pos, chatObj){
    if(sentiment.length == sentimentMax){
        sentiment.pop();
    }
    getSentiments(text, function(keywords){
        var avg = 0;
        for (var i in keywords){
            var obj = {
                "pos" : pos,
                "color" : [],
                "text" : keywords[i].text,
                "index" : sentimentIndex
            };
            for(var j = 0 ; j < keywords[i].text.length; j++ ){
                var color = getSentimentColor(col.theme.getColor(table[pos].theme),
                                              parseFloat(keywords[i].sentiment));
                obj.color.push(color);
            }
            
            sentimentIndex++;
            sentiment.push(obj);
            avg += parseFloat(keywords[i].sentiment);
        }
        if(keywords.length != 0){
            avg = avg / keywords.length;
            //adjust color in chat
            chatObj.color = getSentimentColor(chatObj.color,avg);
        }
        //add the chat object with the sentiment adjusted color
        chatIndex++;
        chat.push(chatObj);
    });
}

/*
adds text to the chat stream
returns the index where the last chat line was added
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
        "name" : table[pos].name,
        "time" : String(Math.round(new Date().getTime() / 1000))
    };
    addSentiment(text, pos, obj);
}

/*
extracts sentiment scores from the text
uses AlchemyAPI by default. 
uses SentiWordNet if swn is true
*/
function getSentiments(text,callback){
    if(swn){
        getSentimentsFromSWN(text,callback);
    }
    else{
        getSentimentsFromAlchemy(text,callback);
    }
}

/*
extracts sentiment score using AlchemyAPI
*/
function getSentimentsFromAlchemy(text, callback){
    var apikey = '1e9868483244e57f2ddb61670c0b361ed2a2f204';
    var alchemy = {
        host: 'access.alchemyapi.com',
        path: '/calls/text/TextGetRankedKeywords?apikey='+ apikey +
              '&outputMode=json&maxRetrieve=5&sentiment=1&text=' 
              + encodeURIComponent(text)
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
                    'text': t,
                    'sentiment' : s
                });
            }
            callback(keywords);
        });
    });
}

/*
extracts sentiment score using SentiWordNet
this function does absolutely nothing to select important keywords
which may result in it generating a lot of keyword
*/
function getSentimentsFromSWN(text, callback){    
    var words = text.split(' ');
    var keywords = [];
    for(var i in words){
        callSWN(words[i],function(score){
            keywords.push({
                    'text' : words[i],
                    'sentiment':score
                });
        });
    }
}
/* helper funciton scrapes data from SWN webpage*/
function callSWN(text,callback){
    var swn = {
        host: 'sentiwordnet.isti.cnr.it',
        path: '/search.php?q='+encodeURIComponent(text)
    };
    http.get(swn, function(res){
        var data = "";
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function(){
            var lines = data.split('\n');
            if(lines[25] !== undefined && lines[27] !== undefined){
                var pline = lines[25].split(': ');
                var nline = lines[27].split(': ');
                if(pline.length == 2 && nline.length==2){
                    pline = pline[1].split('<');
                    nline = nline[1].split('<');
                    var p = parseFloat(pline[0]);
                    var n = parseFloat(pline[0]);
                    var score = p - n;
                    console.log(score);
                    callback(score);
                }
            }
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
    for(var i in table){
        table[i].leave();
    }
    //reset chat
    chat = [];
    chatIndex = 0;
    //reset  sentiment
    sentiment = [];
    sentimentIndex = 0;
    //reset circles
    circles = [];
    
    inUse = false;
}

app.listen(process.env.PORT);
