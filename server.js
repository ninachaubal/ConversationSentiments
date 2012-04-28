

/**************************************************
 * SERVER STUFF STARTS
 *************************************************/
//user
var usr = require('./user');
//http object
var http = require('http');
//create a server
var express = require('express')
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

/*
deliver index.html
*/
app.use(express.static(__dirname + '/chat'));

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
[{"pos":"4","color":"#0D3233", "text":"keyword","index"="4"},{...}]

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
color = the color representing the user 
pos = the position of the user (see position in User.join)
*/
app.post('/user', function(req, res){
    var name = req.param('name');
    var color = req.param('color');
    var pos = req.param('pos');
    if(pos != undefined && pos >= 0 && pos <= 3 &&
       color !== undefined && name !== undefined && name.length > 0){
        //adjust color for default value
        color = getSentimentColor(color,0);
        table[pos].join(color, name, pos);
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
        res.send('',200);
    }
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
            var sentimentColor = getSentimentColor(table[pos].color, 
                                                   keywords[i].sentiment); 
            var obj = {
                "pos" : pos,
                "color" : sentimentColor,
                "text" : keywords[i].text,
                "index" : sentimentIndex
            };
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
    var hsv = rgbToHsv(r,g,b);
    
    //change the value (hsv[2])
    score += 1; //score is now in [0,2] range
    hsv[2] = Math.round(score*50);
    
    var rgb = hsvToRgb(hsv[0],hsv[1],hsv[2]);
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

app.listen(process.env.PORT);



/*
 * hsv <-> rbg conversion code adapted from 
 * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h*360);
    s = Math.round(s*100);
    v = Math.round(v*100);
    return [h, s, v];
}

function hsvToRgb(h, s, v){
    h = h/360;
    v = v/100;
    s = s/100;
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    r = Math.round(r*255);
    g = Math.round(g*255);
    b = Math.round(b*255);
    return [r, g, b];
}
