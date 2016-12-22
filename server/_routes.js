app.get("/", function(request, response){
    response.sendFile(__dirname + "/views/main-menu.html");
});

app.get("/game", function(request, response){
    response.sendFile(__dirname + "/views/game.html");
});

