var script = [
    {'user' : 0, 'text': "hello"},
    {'user' : 1, 'text': "wassup?"},
    {'user' : 2, 'text': "dark"},
    {'user' : 3, 'text': "what a bright and sunny day"}
];

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
        url: '/user?pos=0&name=user1&theme=1'
    });
    //user 2
    $.ajax({
        type: 'POST',
        url: '/user?pos=1&name=user2&theme=2'
    });
    //user 3
    $.ajax({
        type: 'POST',
        url: '/user?pos=2&name=user3&theme=3'
    });
    //user 4
    $.ajax({
        type: 'POST',
        url: '/user?pos=3&name=user4&theme=4'
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
        setTimeout(start(pos+1),1000);
}
