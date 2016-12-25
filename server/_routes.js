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
