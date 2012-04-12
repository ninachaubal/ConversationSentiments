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


//create a server
var app = require('express').createServer();
//array of users - we support at most 8 users at a time
var table = [new User(),new User(),new User(),new User(),
             new User(),new User(),new User(),new User()];
//chat stream
var chat = [];

//sentiment output stream
var sentiment = [];


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
returns the chat stream
example output - 
[{"name":"user1", "color":"#11AFBA","text":"Hi"},
{"name":"user2", "color":"#A82A2A","text":"ssup?"},
{"name":"user1", "color":"#11AFBA","text":"nm"}]
*/
app.get('/stream', function(req, res){
    res.json(chat,200);
});

/*
GET /sentiments
returns the sentiment stream
example output -
[{"pos":"4","color":"#0D3233", "text":"keyword"},{...}]

here the sentiment data is already added to the color
*/
app.get('/sentiments', function(req, res){
    res.json(sentiment, 200);
});


app.listen(process.env.PORT);