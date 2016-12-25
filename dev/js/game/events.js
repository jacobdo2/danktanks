
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


