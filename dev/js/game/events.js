window.onload = function(){
    // var testTank = clone(defaultTank);
    // testTank.x = 1050;
    // tanks.push(testTank);
    console.log("testing branch");
    var userTank = clone(defaultTank);
    socket.on('join game', function(response){
        var response = JSON.parse(response);
        clientId = response.userId;
        userTank.userId = response.userId;
        userTank.name = response.username;
        userTank.team = response.userId;
        tankToControl = userTank;
        tanks.push(userTank);

<<<<<<< HEAD
        ticker = setInterval(function () {
            if (gameStarted) {
                checkInput(userTank);
                moveBullets();
                updateTanks();
                updateEffects();
            }
            draw();
        }, 16.67);
    });
};
=======
    window.onload = function(){
        // var testTank = clone(defaultTank);
        // testTank.x = 1050;
        // tanks.push(testTank);
        console.log("testing branch");
        var userTank = clone(defaultTank);
        socket.on('join game', function(response){
            var response = JSON.parse(response);

            if(response.status == 'error'){
                //send back to main menu if no username entered
                window.location.replace('/');
            }

            clientId = response.userId;
            userTank.userId = response.userId;
            userTank.name = response.username;
            userTank.team = response.userId;
            tankToControl = userTank;
            tanks.push(userTank);

            ticker = setInterval(function () {
                if (gameStarted) {
                    checkInput(userTank);
                    moveBullets();
                    updateTanks();

                }
                draw();
            }, 16.67);
        });
    }


>>>>>>> 6a861399be6f0a3c3942ff4a65e46abd82be73a6
