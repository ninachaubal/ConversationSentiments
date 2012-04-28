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

var textPositions = [{x:25,y:25},{x:width-25,y:25},
                 {x:width-25,y:height-25},{x:25,y:height-25}];
                 
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
        /*var sentiment = sentimentBuffer.pop();
        var r = parseInt(sentiment.color.substring(1,3),16);
        var g = parseInt(sentiment.color.substring(3,5),16);
        var b = parseInt(sentiment.color.substring(5,7),16);
        drawText(sentiment.text,
                 textPositions[sentiment.pos].x,textPositions[sentiment.pos].x,
                 r,g,b);*/
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

void drawText(String txt,float x, float y, float r, float g, float b){
    //placeholder code
    fill(r,g,b);
    text(txt,x,y);
    //TODO: physics stuff
}