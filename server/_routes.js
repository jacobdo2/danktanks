app.get("/", function(request, response){
    response.sendFile(__dirname + "/views/main-menu.html");
});

app.get("/game", function(request, response){
    response.sendFile(__dirname + "/views/game.html");
});

app.post("/set-username", function(request, response){
    request.session.username = request.body.username;

    //save join instance in db
    var query = 'INSERT INTO quickplay_users VALUES (null, ?, ?, NOW(), null)';
    var inserts = [request.session.username, request.connection.remoteAddress];
    query = mysql.format(query, inserts);

    connection.query(query, function(error, result){

        //save user id in the session
        request.session.user_id = result.insertId;

        //send response to the client
        response.send({status:"success"});
    })
});

app.get('/get-username', function(request, response){
    response.send({"username":request.session.username});
})
