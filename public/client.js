//user vars
var pos = -1;

//stream vars
var lastChat = -1;
var lastSentiment = -1;

$(document).ready(function(){
    //hide new user window
    $('#adduser').hide();
    //send button
    $('#btn').click(function(){
        if(pos>=0 && pos<=7){
            sendMessage($('#input').val());
        }
    });
});

function updateChat(){
    $.ajax({
        url: '/stream?last='+lastChat,
        sucess: function(data){
            var content = $('#output').html();
            for(var i in data){
                if(data[i].index > lastChat){
                    lastChat = data[i].index;
                    content += '<p><span style="color:' + data[i].color +'">' + 
                    data[i].name + ':</span>' + data[i].text + '</p>';
                }
            }
        } 
    });
}

function updateCanvas(){
    var context = canvas.getContext("2d");
    //draw table
    $.ajax({
        url: '/table',
        success: function(data){
            for(var i in data){
                console.log(JSON.stringify(data[i]));
                //draw user circle
                context.beginPath();
                context.arc(positions[i].x, positions[i].y,
                            radius, 0, 2*Math.PI, false);
                context.fillStyle = data[i].color;
                context.fill();
            }
        }
    });
    //draw sentiments
    $.ajax({
        url: '/sentiments',
        success: function(data){
            for(var i in data){
                if(data[i].index > lastSentiment){
                    lastSentiment = data[i].index;
                    context.font = "40pt Helvetica";
                    context.fillStyle = data[i].color;
                    context.fillText(data[i].text,
                                     textPositions[parseInt(data[i].pos,10)].x,
                                     textPositions[parseInt(data[i].pos,10)].y);
                }
            }
        }
    });
}

function addUser(){
}

function sendMessage(text){
    $.ajax({
        type: 'POST',
        url: '/chat?pos='+pos+'&text='+encodeURIComponent(text)
    });
}

function canvasClick(e){
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    
    for(var i in positions){
        if(Math.sqrt((x-positions[i].x)*(x-positions[i].x) + 
                     (y-positions[i].y)*(y-positions[i].y)) <= radius){
            pos = i;
            $('#adduser').show();
        }
    }
}
