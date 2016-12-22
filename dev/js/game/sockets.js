var socket = io();

socket.on('update tank positions', function (tank) {
    //var tank = JSON.parse(tank);
    if (tank.userId == clientId) {
        return;
    }
    var tankExists = false;
    for (var i = 0; i < tanks.length; i++) {
        if (tanks[i].userId == tank.userId) {
            tanks[i] = tank;
            tankExists = true;
        }

    }
    if (!tankExists) {
        tanks.push(tank);
    }
});

socket.on('bullet shot', function (bullet) {
    // Check if bullet doesn't already exist
    var bulletExists = false;
    for (var i = 0; i < bullets.length; i++) {
        if (bullet.bulletId == bullets[i].bulletId) {
            bulletExists = true;
            return;
        }
    }
    if (!bulletExists) {
        bullets.push(bullet);
    }
});