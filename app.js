var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){
    console.log("listening on 3000");
});

app.get("/", function(request, response){
    response.sendFile(__dirname+"/index.html");
});

app.use(express.static("public"));

var usersConnected = 0;

io.on('connection', function(socket){
    console.log("connected");
    usersConnected++;
    // Send user id
    var response = {'userId':usersConnected};
    socket.emit('join game', JSON.stringify(response));

    // Update tank positions for connected clients
    socket.on('update tank positions', function (tank) {
        io.emit('update tank positions', tank);
        //console.log("updating tank positions");
    });

    // Create a bullet for connected clients
    socket.on('bullet shot', function (bullet) {
        io.emit('bullet shot', bullet);
        console.log("bullet sent");
    });
});
