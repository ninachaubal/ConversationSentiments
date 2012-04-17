
var width = 800;
var height = 800;

//stream vars
var lastSentiment = -1;

//sentiment buffer
var sentimentBuffer = [];

//table 
var table;

/*
positions
0----1----2
|         |
7         3
|         |
6----5----4
*/
var positions = [{x:25,y:25},{x:width/2,y:25},{x:width-25,y:25},{x:width-25,y:height/2},
                 {x:width-25,y:height-25},{x:width/2,y:height-25},{x:25,y:height-25},{x:25,y:height/2}];

var textPositions = [{x:25,y:25},{x:width/2,y:25},{x:width-25,y:25},{x:width-25,y:height/2},
                 {x:width-25,y:height-25},{x:width/2,y:height-25},{x:25,y:height-25},{x:25,y:height/2}];
                 
var diam = 40;

void setup(){
    size(width,height);
    background(0);
}

void draw(){
    //get updates from server
    update();
    //draw the table
    for(var i in table){
        var r = parseInt(table[i].color.substring(1,3),16);
        var g = parseInt(table[i].color.substring(3,5),16);
        var b = parseInt(table[i].color.substring(5,7),16);
        fill(r,g,b);
        ellipse(positions[i].x,positions[i].y, diam, diam);
    }
    while(sentimentBuffer.length>0){
        var sentiment = sentimentBuffer.pop();
        var r = parseInt(sentiment.color.substring(1,3),16);
        var g = parseInt(sentiment.color.substring(3,5),16);
        var b = parseInt(sentiment.color.substring(5,7),16);
        drawText(sentiment.text,
                 textPositions[sentiment.pos].x,textPositions[sentiment.pos].x,
                 r,g,b);
    }
}

void update(){
    //table
    $.ajax({
        url: '/table',
        success: function(data){
            table = data;
        }
    });
    //sentiments
    $.ajax({
        url: '/sentiments?last='+lastSentiment,
        success: function(data){
            for(var i in data){
                if(data[i].index > lastSentiment){
                    lastSentiment = data[i].index;
                    sentimentBuffer.push(data[i]);
                }
            }
        }
    });
}


void drawText(String txt,float x, float y, float r, float g, float b){
    //placeholder code
    fill(r,g,b);
    text(txt,x,y);
    //TODO: physics stuff
}