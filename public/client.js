//user vars
var pos = -1;

//stream vars
var lastChat = -1;
var lastSentiment = -1;

//sentiment buffer
var sentimentBuffer = [];

//table 
var table;

$(document).ready(function(){
    //hide new user window
    $('#adduser').hide();
    //send button
    $('#btn').click(function(){
        if(pos>=0 && pos<=7){
            sendMessage($('#input').val());
            $('#input').val('');
        }
    });
    //cancel
    $('#cancel').click(function(){
        pos = -1;
        $('#username').val('');
        $('#color').val('');
        $('#adduser').hide();
    });
    //add user
    $('#join').click(function(){
        addUser($('#username').val(),$('#color').val());
        $('#adduser').hide();
    });
});

function update(){
    updateChat();
    updateTable();
    updateBuffer();
}

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

function updateTable(){
    $.ajax({
        url: '/table',
        success: function(data){
            table = data;
        }
    });
}

function updateBuffer(){
    $.ajax({
        url: '/sentiments',
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

function addUser(name,color){
    $.ajax({
        url: '/user?pos='+pos+'&name='+encodeURIComponent(name) + 
             '&color='+encodeURIComponent(color)
    });
}

function sendMessage(text){
    $.ajax({
        url: '/chat?pos='+pos+'&text='+encodeURIComponent(text)
    });
}
