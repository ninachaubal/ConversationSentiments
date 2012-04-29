var script = [
    {'user' : 1, 'text': "hello"},
    {'user' : 2, 'text': "wassup?"}
];

$(document).ready(function(){
    //add our users to the conversation 
    addUsers();
    //start the conversation
    start(0);
    //remove all users
    removeUsers();
});

function addUsers(){
    //user 1
    $.ajax({
        type: 'POST',
        url: '/user?pos=0&name=user1&theme=1'
    });
    //user 1
    $.ajax({
        type: 'POST',
        url: '/user?pos=1&name=user2&theme=2'
    });
    //user 1
    $.ajax({
        type: 'POST',
        url: '/user?pos=2&name=user3&theme=3'
    });
    //user 1
    $.ajax({
        type: 'POST',
        url: '/user?pos=3&name=user4&theme=4'
    });
}

function start(pos){
    if(script[pos] === undefined){
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/chat?pos=' + (script[pos].user - 1) +
             '&text='+encodeURIComponent(script[pos].text)
    });
    setTimeout(start(pos+1),Math.round(Math.random()*2000));
}

function removeUsers(){
    //user 1
    $.ajax({
        type: 'DELETE',
        url: '/user?pos=1'
    });
    //user 2
    $.ajax({
        type: 'DELETE',
        url: '/user?pos=2'
    });
    //user 3
    $.ajax({
        type: 'DELETE',
        url: '/user?pos=3'
    });
    //user 4
    $.ajax({
        type: 'DELETE',
        url: '/user?pos=4'
    });
}
