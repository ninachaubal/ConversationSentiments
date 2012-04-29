//user vars
var pos = -1;

//stream vars
var lastChat = -1;

//table 
var table;

//circles
var circles;

$(document).ready(function(){
    //hide new user window
    $('#adduser').hide();
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
        }
    });
    $('#orange').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),2);
            $('#adduser').hide();
        }
    });
    $('#violet').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),3);
            $('#adduser').hide();
        }
    });
    $('#green').click(function(){
        if($('#username').val() !== undefined){
            addUser($('#username').val(),4);
            $('#adduser').hide();
        }
    });
    
    //unload
    $(window).unload(function(){
        alert('hello');
        removeUser();
    });
    
    alert("Choose a position to get started.");
});

function update(){
    updateChat();
    updateTable();
    updateCircles();
}

function updateChat(){
    $.ajax({
        url: '/stream?last='+lastChat,
        success: function(data){
            var content = $('#output').html();
            for(var i in data){
                if(data[i].index > lastChat){
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
