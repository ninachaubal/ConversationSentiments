//user vars
var pos = -1;

//stream vars
var lastChat = -1;
var lastSentiment = -1;

//sentiment buffer
var sentimentBuffer = [];

//chat buffer
var chatBuffer = [];

//table 
var table;

//circles
var circles = [];

//first time stamp
var firstTS = undefined;

//starting x coord for the linear viz 
var startx = 0;

//number of pixels representing 1 second in the linear viz
var pixps = 5;

//options
var bg = 'black';
var type = 'splatters';
var ltype = 'order';

$(document).ready(function(){
    //hide new user window
    $('#adduser').hide();
    //hide options
    $('#options').hide();
    
    //send button
    $('#btn').click(function(){
        if(pos>=0 && pos<=3){
            sendMessage($('#inp').val());
        } else {
            alert("click on a position to join the conversation");
        }
        $('#inp').val('');
    });
    //cancel
    $('#cancel').click(function(){
        pos = -1;
        $('#username').val('');
        $('#color').val('');
        $('#adduser').hide();
    });
    //add user 
    $('#blue').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),1);
            $('#adduser').hide();
        } else {
            pos = -1;
        }
    });
    $('#orange').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),2);
            $('#adduser').hide();
        } else {
            pos = -1;
        }
    });
    $('#violet').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),3);
            $('#adduser').hide();
        } else {
            pos = -1;
        }
    });
    $('#green').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),4);
            $('#adduser').hide();
        } else {
            pos = -1;
        }
    });
    
    //options
    $(".inline").colorbox({inline:true, width:"50%"});
    $('#bg').change(function(){
        changeTheme($('#bg').val());
    });
    $('#viztype').change(function(){
        type = $('#viztype').val(); 
    });
    $('#linviztype').change(function(){
        ltype = $('#viztype').val(); 
    });
    $('#senti').change(function(){
        changeSenti($('#senti').val());
    });
    
    //unload
    $(window).unload(function(){
        removeUser();
    });
});

function changeTheme(color){
    bg = color;
    if(color == 'white'){
        //make everything else black
        $('#adduser').css('background-color','#000000');
        $('#adduser').css('color','#ffffff');
        
    } else {
        //make everything else white
        $('#adduser').css('background-color','#ffffff');
        $('#adduser').css('color','#000000');
    }
    
}

function changeSenti(source){
    if(source == 'senti'){
        $.ajax({
            type: 'POST',
            url: '/swn?val=true'
        });
    } else {
        $.ajax({
            type: 'POST',
            url: '/swn?val=false'
        });
    }
}

function update(){
    //updateChat(); this is now done from linear.pde
    updateTable();
    //updateCircles(); //circles doesn't work
    updateBuffer();
}

function updateChat(){
    $.ajax({
        url: '/stream?last='+lastChat,
        success: function(data){
            var content = $('#output').html();
            for(var i in data){
                if(data[i].index > lastChat){
                    if(firstTS === undefined){
                        firstTS = parseInt(data[i].time,10);
                    }
                    chatBuffer.push(data[i]);
                    lastChat = data[i].index;
                    content += '<p><span style="color:' + data[i].color +'">' + 
                    data[i].name + ':</span>' + data[i].text + '</p>';
                }
            }
            $('#output').html(content);
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

function updateCircles(){
    $.ajax({
        url: '/circles',
        success: function(data){
            circles = data;
        }
    });
}

function updateBuffer(){
    $.ajax({
        url: '/sentiments?last='+lastSentiment,
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

function addUser(name,theme){
    $.ajax({
        type: 'POST',
        url: '/user?pos='+pos+'&name='+encodeURIComponent(name) + 
             '&theme='+encodeURIComponent(theme)
    });
}

function removeUser(){
    $.ajax({
        type: 'DELETE',
        url: '/user?pos='+pos
    });
}

function sendMessage(text){
    $.ajax({
        type: 'POST',
        url: '/chat?pos='+pos+'&text='+encodeURIComponent(text)
    });
}
