/* @pjs font="ARLRDBD.TTF"; */

var width = 600;
var height = 600;

/*
positions
0---------1
|         |
|         |
|         |
3---------2
*/
var positions = [{x:25,y:25},{x:width-25,y:25},{x:width-25,y:height-25},{x:25,y:height-25}];
var textPositions = [{x:50,y:50},{x:width-50,y:50},{x:width-50,y:height-50},{x:50,y:height-50}];                 
var diam = 40;
var namePositions = [{x:25+diam,y:25},{x:width-25-diam,y:25},{x:width-25-diam,y:height-25},{x:25+diam,y:height-25}];

//temporary buffer for sentiments
var tempBuffer = [];

//counter
var counter = 0;

PFont myFont;

void setup(){
    size(width,height);
    smooth();
    myFont = createFont("ARLRDBD.TTF", 13);
}

void draw(){
    background(0);
    //empty temp once every 5 seconds (assuming 60fps)
    if(counter%300 == 0){
        tempBuffer = [];
    }
    //get updates from server
    update();
    //draw the table
    for(var i in table){
        var r = parseInt(table[i].color.substring(1,3),16);
        var g = parseInt(table[i].color.substring(3,5),16);
        var b = parseInt(table[i].color.substring(5,7),16);
        fill(r,g,b);
        ellipse(positions[i].x,positions[i].y, diam, diam);
        var x = namePositions[i].x;
        if(i == 1 || i == 2){
            x -= (table[i].name.length) * 3; 
        }
        text(table[i].name,x, namePositions[i].y);
    }
    
    /*
    //draw circles
    for (var i in circles){
        var r = parseInt(circles[i].col.substring(1,3),16);
        var g = parseInt(circles[i].col.substring(3,5),16);
        var b = parseInt(circles[i].col.substring(5,7),16);
        fill(r,g,b);
        var d = 2*circles[i].rad;
        ellipse(circles[i].x,circles[i].y, d, d);
        //TODO: display character
        if(circles[i].chr != ''){
            rotate by circles[i].ang
            display circles[i].chr
        }
        */
    
    //display previous sentiments from temp
    //this causes the sentiments to be shown for a longer time so they can be read
    for(var i in tempBuffer){
        drawSentiment(tempBuffer[i]);
    }
    
    //display keywords - doing this since circles dont work and I want to display something
    while(sentimentBuffer.length > 0){
        var sentiment = sentimentBuffer.pop();
        drawSentiment(sentiment);
        tempBuffer.push(sentiment);
    }
    counter ++;
}

//draws the keywords in circles
void drawSentiment(sentiment){
    for(var i in sentiment.color){
        var r = parseInt(sentiment.color[i].substring(1,3),16);
        var g = parseInt(sentiment.color[i].substring(3,5),16);
        var b = parseInt(sentiment.color[i].substring(5,7),16);
        var x = textPositions[sentiment.pos].x;
        if(sentiment.pos == 1 || sentiment.pos == 2){
            x -= (sentiment.text.length * 7);
        }
        var y = textPositions[sentiment.pos].y + Math.round(Math.random()*10);
        var d = 2*Math.round(5 + Math.random()*2); //radius = 5 to 7 
        fill(r,g,b);
        ellipse(x+i,y,d,d);
        textFont(myFont);
        text(sentiment.text.charAt(i), x+i-5, y+5);
    }
}

void mouseClicked(){
    var x = mouseX;
    var y = mouseY;
    if(pos >= 0 && pos <=3){
        //user has already signed in
        return;
    }
    for(var i in positions){
        if(table[i].color != '#ffffff'){
            //some other user is logged in at this position
            continue;
        }
        if(x >= (positions[i].x - diam/2) && x <= (positions[i].x + diam/2) &&
           y >= (positions[i].y - diam/2) && y <= (positions[i].y + diam/2) ){
            pos = i;
            $('#adduser').show();
            return;
        }
    }
    //the user clicked on something other than one of the circles
    pos = -1;
    $('#username').val('');
    $('#color').val('');
    $('#adduser').hide();
}