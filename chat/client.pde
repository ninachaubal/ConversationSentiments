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
var positions = [{x:0,y:0},{x:width,y:0},{x:width,y:height},{x:0,y:height}];
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
    
    
    //draw circles
    for (var i in circles){
        var r = parseInt(circles[i].col.substring(1,3),16);
        var g = parseInt(circles[i].col.substring(3,5),16);
        var b = parseInt(circles[i].col.substring(5,7),16);
        fill(r,g,b);
        var d = 2*circles[i].rad;
        ellipse(circles[i].x,circles[i].y, d, d);
        if(circles[i].chr != ''){
            text(circles[i].chr,circles[i].x - 5,circles[i].y +5);
        }
    }
    counter ++;
    
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