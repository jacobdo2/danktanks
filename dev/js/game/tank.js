function updateTanks() {
    for (var i = 0; i < tanks.length; i++) {
        var tank = tanks[i];
        // Check if tank has been destroyed
        if (tank.hp <= 0) {
            tanks.splice(i, 1);
        }

        // Check if tank's energy should be refilled
        if (tank.energy < 100) {
            tank.energy += energyRechargeSpeed;
        }

        // Update the reload timer
        if (tank.reloadTimer > 0) {
            tank.reloadTimer --;
        } else
        // If the timer has ran out, reset it and restore ammo
        if (tank.reloadTimer == 0) {
            tank.reloadTimer = -1;
            tank.ammo = maxAmmo;
        }

        // Update the shoot delay timer
        if (tank.shootDelayTimer > 0) {
            tank.shootDelayTimer --;
        }

        // Calculate tank x and y speed based on rotation
        tank.xspd = tank.movementSpeed*Math.cos(tank.rotation * Math.PI / 180);
        tank.yspd = tank.movementSpeed*Math.sin(tank.rotation * Math.PI / 180);

        // Apply knockback
        tank.xspd += tank.xknockback;
        tank.yspd += tank.yknockback;
        tankMove(tank);

        // Apply friction to speed
        tank.xknockback *= knockbackFriction;
        tank.yknockback *= knockbackFriction;
        // Slow down the tank linearly
        if (tank.movementSpeed > 0) {
            tank.movementSpeed -= Math.min(tankDeceleration, tank.movementSpeed);
        }
    }
    // Send new tank position information to server
    socket.emit("update tank positions", tankToControl);
}

function tankMove(tankToMove) {
    if (tankToMove == null) {
        return;
    }
    // Check for collisions
    checkTankCollisions(tankToMove);
    // Move the tank
    tankToMove.x += tankToMove.xspd;
    tankToMove.y += tankToMove.yspd;

}

function checkTankCollisions(curTank) {
    var collisionHappened = false;
    var newX = curTank.x + curTank.xspd;
    var newY = curTank.y + curTank.yspd;
    // Check for collisions with each level object
    for (var i = 0; i < level.length; i++) {
        var obj = level[i];

        // Check on X axis with current X velocity
        if (isCollide(curTank, obj, newX, curTank.y)) {
            curTank.xspd = 0;
            collisionHappened = true;
        }

        // Check on Y axis with current Y velocity
        if (isCollide(curTank, obj, curTank.x, newY)) {
            curTank.yspd = 0;
            collisionHappened = true;
        }

        // Check on diagonal axis if collision hasn't happened on X/Y, with both X and Y velocity
        if (!collisionHappened) {
            if (isCollide(curTank, obj, newX, newY)) {
                curTank.xspd = 0;
                curTank.yspd = 0;
                curTank.movementSpeed = 0;
                collisionHappened = true;
                console.log("collided on diagonal");
            }
        }
    }

    // Check for collisions with other tanks
    /*
    for (var t = 0; t < tanks.length; t++) {
        var tank = tanks[t];

        // Don't check for collisions with itself
        if (tank == curTank) { return; }

        // Check on X axis with current X velocity
        if (isCollide(curTank, tank, newX, curTank.y)) {
            curTank.xspd = 0;
            collisionHappened = true;
        }

        // Check on Y axis with current Y velocity
        if (isCollide(curTank, tank, curTank.x, newY)) {
            curTank.yspd = 0;
            collisionHappened = true;
        }

        if (!collisionHappened) {
            if (isCollide(curTank, tank, newX, newY)) {
                curTank.xspd = 0;
                curTank.yspd = 0;
                collisionHappened = true;
                console.log("collided with another tank");
            }
        }
    }*/
}

function isCollide(a, b, newX, newY) {
    return !(
        ((newY + a.height) < (b.y)) ||
        (newY > (b.y + b.height)) ||
        ((newX + a.width) < b.x) ||
        (newX > (b.x + b.width))
    );
}