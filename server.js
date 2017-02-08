var express = require('express');
var connect= require('connect');
  
var app = express();
var fs = require('fs');
var http = require('http');


app.use(express.static(__dirname,  {redirect: false}));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

fs.readdir(__dirname, function(err, files) {
    for(var i = 0; i < files.length; i++) {
        var ndx = files[i].indexOf('.html');
        if(ndx !== -1 && files[i] !== 'index.html') {
            var name = files[i].substr(0, ndx);
            app.get('/'+name, function(req, res) {
                res.sendfile(__dirname + req.path +".html");
            });
        }
    }
});

http.createServer(app).listen(8081);
console.log("Listening on 8081...");
