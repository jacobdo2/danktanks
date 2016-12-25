var io = require('socket.io')(http);

io.use(sharedSession(session, {
    autoSave:true
}));

var usersConnected = 1;

io.on('connection', function(socket){

    usersConnected++;
    // Send user id and user name

    //retrieve entered username from the session
    var username = socket.handshake.session.username;
    var response = {};
    if(!username){
        response.status = 'error';
    }
    else {
        response.status = 'success';
        response.userId = usersConnected;
        response.username = username;
    }

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