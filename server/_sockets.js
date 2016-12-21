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
        io.emit('update tank positions', tank);
        //console.log("updating tank positions");
    });

    // Create a bullet for connected clients
    socket.on('bullet shot', function (bullet) {
        io.emit('bullet shot', bullet);
        console.log("bullet sent");
    });
});