
var startTS;

void setup(){
    size(600,100);
    smooth();
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
    //update start c
    updateStartX();
    //update chat buffer
    updateChat();
    //update starting time stamp
    if(ltype == 'time'){
        getStartTS();
        for(var i in chatBuffer){
            var ts = parseInt(chatBuffer[i].time,10); 
            var text = chatBuffer[i].text.split(' ');
            if( ts + text.length >= startTS){
                var offset = (ts - startTS)*pixps;
                if(offset>width){
                    break;
                }
                var r = parseInt(chatBuffer[i].color.substring(1,3),16);
                var g = parseInt(chatBuffer[i].color.substring(3,5),16);
                var b = parseInt(chatBuffer[i].color.substring(5,7),16);
                fill(r,g,b);
                for(var j in text){
                    rect(offset+(j*pixps),0,pixps,height,5);
                }
            }
        }
    } else {
        var count = 0;
        for(var i in chatBuffer){
            var text = chatBuffer[i].text.split(' ');
            if( (count + text.length)*pixps >= startx ){
                var offset = count*pixps - startx;
                if(offset > width){
                    break;
                }
                var r = parseInt(chatBuffer[i].color.substring(1,3),16);
                var g = parseInt(chatBuffer[i].color.substring(3,5),16);
                var b = parseInt(chatBuffer[i].color.substring(5,7),16);
                fill(r,g,b);
                for(var j in text){
                    rect(offset+(j*pixps),0,pixps,height,5);
                }
            }
            count += text.length;
        }
    }
}

void getStartTS(){
    startTS = firstTS + startx/pixps;
}

void updateStartX(){
    if(mouseX>0 && mouseX < 50){
        //left
        startx += pixps;
    } else if(mouseX > 550 && mouseX <600){
        //right
        if(startx >= pixps)
            startx -= pixps;
    }
}
