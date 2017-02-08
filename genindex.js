var fs = require('fs');

var html = "<!DOCTYPE html><html><head>\
<style>\
 html, body{margin:0;background:#000;color:#fff;}\
 .demotile{\
    display:inline-block;\
    margin: 10px; \
    padding: 10px;\
    box-shadow: 0 0 8px #fff;\
 }\
 .demotile img{width:512;height:256;} \
</style>\
</head><body>";

fs.readdir(__dirname, function(err, files) {
    
    for(var i = 0; i < files.length; i++) {
        var ndx = files[i].indexOf('.html');
        if(ndx !== -1 && files[i].indexOf('index.html') === -1) {
            var name = files[i].substr(0, ndx);
            html += 
            "<div class='demotile'>\n\
                <h3>"+name+"</h3>\n\
                <a href='/"+name+"'>\n\
                    <img src='thumbs/"+name+".png'>\n\
                <a>\n\
            </div>";
        }
    }
    html += "</body></html>";        

    fs.writeFile(__dirname+"/demo_index.html", html, function(err) {
        if(err) { console.log("error", err); }
        else { console.log("ok"); }
    });

});

