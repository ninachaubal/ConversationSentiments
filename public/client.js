//canvas vars
var canvas;
var start;

//user vars
var pos = 1;

//stream vars


$(document).ready(function(){
    //hide new user window
    $('#adduser').hide();
    //send button
    $('#btn').click(function(){
        if(pos>=0 && pos<=7){
            sendMessage($('#input').val());
        }
    });
    //initialize canvas
    canvas = document.getElementByID('canvas');
    start = Date.now();
    window.requestAnimationFrame(update,canvas);
});

function update(){
    updateChat();
    updateCanvas();
    window.requestAnimationFraw(update,canvas);
}

function updateChat(){
    
}

function updateCanvas(){
}

function addUser(){
}

function sendMessage(text){
    $.ajax({
        type: 'POST',
        url: '/chat?pos='+pos+'&text='+encodeURIComponent(text)
    });
}