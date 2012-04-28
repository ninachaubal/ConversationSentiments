/* 
The User class
*/
var User = function(){
    this.init();
};

User.prototype.init = function(){
    this.color = '#ffffff';
    this.name = '';
    this.position = -1;
    this.isConversing = false;
};

/*
call when a user joins the conversation
position refers to one of the locations defined by the client

0---------1
|         |
|         |
|         |
3---------2

*/
User.prototype.join = function(color,name, position){
    if(color !== undefined && name !== undefined &&
       name.length > 0 && position !== undefined &&
       position >= 0 && position <= 3){
        this.color = color;
        this.name = name;
        this.isConversing = true;
        this.position = position;
    }
};

User.prototype.leave = function(){
    //reset everything
    this.init();
};

/*
returns an object representing this object if the user is conversing
*/
User.prototype.getData = function(){
    var obj = {};
    obj.name = this.name;
    obj.color = this.color;
    obj.position = this.position;
    return obj;
};

exports.User = User;