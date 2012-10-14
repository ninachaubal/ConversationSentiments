//colors
var col = require('./colors');
var colors = col.colors();
//Sentimental
var analyze = require('Sentimental').analyze;
//create a server
var express = require('express');
var app = express();

/*
mount static content at /
*/
app.use(express.static(__dirname + '/static'));

app.listen(process.env.PORT);
