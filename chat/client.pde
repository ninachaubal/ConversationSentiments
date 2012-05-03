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

//counter
var counter = 0;

PFont myFont;

void setup(){
    size(width,height);
    smooth();
    myFont = createFont("ARLRDBD.TTF", 13);
}

void draw(){
    if(bg == 'black'){
        background(0);
    } else {
        background(255);
    }
    //draw frame
    stroke(0);
    line(0,0,width,0);
    line(0,0,0,height);
    line(width-1,0,width-1,height);
    line(0,height-1,width,height-1);
    noStroke();
    //get updates from server
    update();
    
    var reset = true;
    //draw the table
    for(var i in table){
        var col = table[i].color;
        reset = reset && (col == '#ffffff');
        if(bg == 'white' && col == '#ffffff'){
            col = '#000000'
        }
        var r = parseInt(col.substring(1,3),16);
        var g = parseInt(col.substring(3,5),16);
        var b = parseInt(col.substring(5,7),16);
        fill(r,g,b);
        ellipse(positions[i].x,positions[i].y, diam, diam);
        var x = namePositions[i].x;
        if(i == 1 || i == 2){
            x -= (table[i].name.length) * 3; 
        }
        text(table[i].name,x, namePositions[i].y);
    }
    
    if(reset){
        //if reset is still true the server may have been reset
        resetClient();
    } else {
        //we have atleast one user logged in, it is possible to reset
        resetable = true;
    }
    
    if(type != 'none'){
        //draw old circles
        for(var i in circles){
            if(type == 'circles' && circles[i].l != 4){
                continue;
            }
            fill(circles[i].r,circles[i].g,circles[i].b,circles[i].a);
            ellipse(circles[i].x,circles[i].y,2*circles[i].rad,2*circles[i].rad);
        }
        //draw new sentiments
        while(sentimentBuffer.length != 0){
            var sentiment = sentimentBuffer.pop();
            //we draw one circle or splatter for each keyword
            //since all the colors in sentiment.color are adjusted for
            //the sentiment, we can pick any one of them
            int r = parseInt(sentiment.color[0].substring(1,3),16);
            int g = parseInt(sentiment.color[0].substring(3,5),16);
            int b = parseInt(sentiment.color[0].substring(5,7),16);
            var i = parseInt(sentiment.index)%30;
            int x = (7*i*Math.cos(i)) + (width/2);
            int y = (7*i*Math.sin(i)) + (height/2);
            if (type == 'splatters'){
                drawCircles(x,y,15,4, r, g, b);
            } else {
                drawCircles(x,y,15,1, r, g, b);
            }
        }
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

// Circle splatter machine
void drawCircles(float x, float y, int radius, int level, float r, float g, float b)
{
  noStroke();
  //save this circle
  circles.push({
    x : x,
    y : y,
    rad : radius,
    r : r,
    g : g,
    b : b,
    a : 170,
    l : level
  });
  fill(r,g,b,170);
  ellipse(x, y, radius*2, radius*2);
  if (level > 1) {
    level = level - 1;
    int num = int (random(2, 5));
    for(int i=0; i<num; i++) {
      float a = random(0, TWO_PI);
      float nx = x + cos(a) * 6.0 * level;
      float ny = y + sin(a) * 6.0 * level;
      drawCircles(nx, ny, radius/2, level, r, g, b);
    }
  }
}
