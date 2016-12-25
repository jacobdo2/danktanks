var express = require("express");
var app = express();
var session = require('express-session')({
    secret: 'upvote money cat',
    resave: true,
    saveUninitialized: true,
    genid: function(req) {
        return uuidV4();
    }
});
var sharedSession = require('express-socket.io-session');
var uuidV4 = require('uuid/v4');
var bodyParser = require('body-parser');
var http = require("http").Server(app);

//for post requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//where static files (css, front end js ect. should be served from)
app.use(express.static("public"));

//initialize express session
app.use(session);

http.listen(3000, function(){
    console.log("listening on 3000");
});
app.get("/", function(request, response){
    response.sendFile(__dirname + "/views/main-menu.html");
});

app.get("/game", function(request, response){
    response.sendFile(__dirname + "/views/game.html");
});

app.post("/set-username", function(request, response){
    request.session.username = request.body.username;
    response.send({status:"success"});
});

app.get('/get-username', function(request, response){
    response.send({"username":request.session.username});
})

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