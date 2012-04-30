
var startTS;

void setup(){
    size(600,100);
    smooth();
}

void draw(){
    background(0);
    //update chat buffer
    updateChat();
    //update starting time stamp
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
}

void getStartTS(){
    startTS = firstTS + startx/pixps;
}