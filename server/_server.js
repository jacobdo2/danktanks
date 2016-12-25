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