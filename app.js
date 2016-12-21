var express = require("express");
var app = express();
var http = require("http").Server(app);

app.use(express.static("public"));

http.listen(3000, function(){
    console.log("listening on 3000");
});
app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

var io = require('socket.io')(http);

var usersConnected = 1;

io.on('connection', function(socket){
    console.log("connected");
    usersConnected++;
    // Send user id
    var response = {'userId':usersConnected};
    socket.emit('join game', JSON.stringify(response));

    // Update tank positions for connected clients
    socket.on('update tank positions', function (tank) {
        socket.broadcast.emit('update tank positions', tank);
        //console.log("updating tank positions");
    });

    // Create a bullet for connected clients
    socket.on('bullet shot', function (bullet) {
        socket.broadcast.emit('bullet shot', bullet);
        console.log("bullet sent");
    });
});