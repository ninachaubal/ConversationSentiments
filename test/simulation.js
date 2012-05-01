var users = ['Rachel','Chandler','Ross','Monica'];

var script = [ ], ;

$(document).ready(function(){
    //add our users to the conversation 
    addUsers();
    //start the conversation
    start(0);
});

function addUsers(){
    //user 1
    $.ajax({
        type: 'POST',
        url: '/user?pos=0&name=' + users[0] + '&theme=1'
    });
    //user 2
    $.ajax({
        type: 'POST',
        url: '/user?pos=1&name=' + users[1] + '&theme=2'
    });
    //user 3
    $.ajax({
        type: 'POST',
        url: '/user?pos=2&name=' + users[2] + '&theme=3'
    });
    //user 4
    $.ajax({
        type: 'POST',
        url: '/user?pos=3&name=' + users[3] + '&theme=4'
    });
}

function start(pos){
        if(pos >= script.length){
            console.log(pos);
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/chat?pos=' + (script[pos].user) +
                 '&text='+encodeURIComponent(script[pos].text)
        });
        setTimeout(start(pos+1),10000000);
}
