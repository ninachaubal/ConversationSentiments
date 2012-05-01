var fs = require('fs');
var users = ['Rachel','Chandler','Ross','Monica'];

fs.readFile('621.txt','ascii', function(err, data){
    data = data.split("\n");
    var script = [];
    for(var i in data){
        if(data[i].length === 0){
            continue;
        }
        data[i] = data[i].replace(/\(.*\)/, "");
        data[i] = data[i].replace(/\[.*\]/, "");
        var line = data[i].split(/: /);
        if(line[0] == users[0]){
            script.push({user: 0, text: line[1]});
        } else if (line[0] == users[1]){
            script.push({user: 1, text: line[1]});
        } else if (line[0] == users[2]){
            script.push({user: 2, text: line[1]});
        } else if (line[0] == users[3]){
            script.push({user: 3, text: line[1]});
        }
    }
    console.log(script); 
});
