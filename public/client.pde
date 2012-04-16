var width = 800;
var height = 600;
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
        fill(table[i].color);
        ellipse(positions[i].x,positions[i].y, diam, diam);
    }
}

void mouseClicked(){
    var x = mouseX;
    var y = mouseY;
    if(pos >= 0 && pos <=7){
        //user has already signed in
        return;
    }
    for(var i in positions){
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