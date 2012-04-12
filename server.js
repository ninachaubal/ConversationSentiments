/* 
The User class
*/
var User = function(){
    this.init();
};

User.prototype.init = function(){
    this.color = '#000000';
    this.name = '';
    this.position = -1;
    this.isConversing = false;
};

/*
call when a user joins the conversation
position refers to one of the locations defined by the client

0----1----2
|         |
7         3
|         |
6----5----4

*/
User.prototype.join = function(color,name, position){
    if(color !== undefined && name !== undefined &&
       name.length > 0 && position !== undefined &&
       position >= 0 && position <= 7){
        this.color = color;
        this.name = name;
        this.isConversing = true;
    }
};

User.prototype.leave = function(){
    //reset everything
    this.init();
};

/*
returns an object representing this object if the user is conversing
*/
User.prototype.getData = function(){
    if(!this.isConversing){
        return null;
    }
    var obj = {};
    obj.name = this.name;
    obj.color = this.color;
    obj.position = this.position;
    return obj;
};

/**************************************************
 * SERVER STUFF STARTS
 *************************************************/

//http object
var http = require('http');
//create a server
var app = require('express').createServer();
//array of users - we support at most 8 users at a time
var table = [new User(),new User(),new User(),new User(),
             new User(),new User(),new User(),new User()];
//chat stream
var chat = [];
var chatIndex = 0;
var chatMax = 1000;

//sentiment output stream
var sentiment = [];
var sentimentIndex = 0;
var sentimentMax = 5000;

/*
GET /table 
returns the current list of users on the table
example output - 
[{"name":"user1","color":"#11AFBA","position":"4"},
 {"name":"user2","color":"#A82A2A","position":"7"}]
*/
app.get('/table', function(req, res){
    var arr = [];
    for(var i in table){
        var obj = table[i].getData();
        if(obj !== null){
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
[{"name":"user1", "color":"#11AFBA","text":"Hi","index":"10"},
{"name":"user2", "color":"#A82A2A","text":"ssup?","index":"11"},
{"name":"user1", "color":"#11AFBA","text":"nm"},"index":"12"]
*/
app.get('/stream', function(req, res){
    var last = req.param('last');
    var arr = [];
    for(var i in chat){
        if(last < 0 || chat[i].index > last){
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
[{"pos":"4","color":"#0D3233", "text":"keyword","index"="4"},{...}]

here the sentiment data is already added to the color
*/
app.get('/sentiments', function(req, res){
    var last = req.param('last');
    var arr = [];
    for(var i in sentiment){
        if(last < 0 || sentiment[i].index > last){
            arr.push(sentiment[i]);
        }
    }
    res.json(arr,200);
});

app.get('/test', function(req, res){
    getSentiments("hello", function(data){
        res.send(data);
    });
});

/*
POST /user
params:
name = the user name of the user to add 
color = the color representing the user 
pos = the position of the user (see position in User.join)
*/
app.post('/user', function(req, res){
    var name = req.param('name');
    var color = req.param('color');
    var pos = req.param('pos');
    if(pos != undefined && pos >= 0 && pos <= 7 &&
       color !== undefined && name !== undefined && name.length > 0){
        table[pos].join(color, name, pos);
        res.send('',200);
    }
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
    if(pos !== undefined && pos >= 0 && pos <=7 &&
       text !== undefined && text.length > 0){
        addChatLine(text,pos);
        addSentiment(text,pos);
        res.send('',200);
    }
});

function addSentiment(text, pos){
    if(sentiment.length == sentimentMax){
        sentiment.pop();
    }
    //TODO: perform sentiment analysis and get the appropriate data
    var keywords = [];  //TODO
    for (var i in keywords){
        var sentimentColor = ''; //TODO
        var obj = {
            "pos" : pos,
            "color" : sentimentColor,
            "text" : keywords[i],
            "index" : sentimentIndex
        };
        sentimentIndex++;
        sentiment.push(obj);
    }
}

function addChatLine(text, pos){
    if(chat.length == chatMax){
        chat.pop();
    }
    var obj = {
        "pos" : pos,
        "color" : table[pos].color,
        "text" : text,
        "index" : chatIndex
    };
    chatIndex++;
    chat.push(obj);
}

function getSentiments(text, callback){
    var apikey = '';
    var alchemy = {
        hostname: 'http://access.alchemyapi.com',
        path: '/calls/text/TextGetRankedKeywords?apikey='+ apikey +
              '&outputMode=json&maxRetrieve=5&keywordExtractMode=strict' + 
            '&sentiment=1&text=' + encodeURIComponent(text)
    };
    http.get(alchemy, function(res){
        res.on('data', function(data){
            callback(data);
        });
    });   
}



app.listen(process.env.PORT);