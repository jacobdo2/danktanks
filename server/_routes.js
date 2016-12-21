app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});
