// Gets keyboard inputs
var keys = [];

window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = e.keyCode;
        var keysArray = getNumberArray(keys);
    },
    false);

window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
    false);

function getNumberArray(arr){
    var newArr = new Array();
    for(var i = 0; i < arr.length; i++){
        if(typeof arr[i] === "number"){
            newArr[newArr.length] = arr[i];
        }
    }
    return newArr;
}

// Gets mouse position

canvas.addEventListener("mousemove", function(e){
    getMousePosition(e);
});

canvas.addEventListener("mousedown", function(e){
    // Check button presses
    mousepressed = true;
});

canvas.addEventListener("mouseup", function(e){
    // Check button presses
    mousepressed = false;
});


function getMousePosition(e) {
    var canvasRect = canvas.getBoundingClientRect();
    mouseX = e.clientX - canvasRect.left + viewX;
    mouseY = e.clientY - canvasRect.top + viewY;
    if (tankToControl != null) {
        mouseTankOffsetX = mouseX - tankToControl.x - tankToControl.width/2;
        mouseTankOffsetY = mouseY - tankToControl.y - tankToControl.height/2;
    }
}

// Tank movement input
function checkInput(tankToControl) {
    var tank = tankToControl;
    if (tank == null) {
        return;
    }
    //tank.movementSpeed = 0;
    xaxis = 0;
    yaxis = 0;
    // For button codes refer to:
    // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    // Up W
    if (keys[87]) { yaxis -= 1;}
    // Down S
    if (keys[83]) { yaxis += 1;}
    // Left A
    if (keys[65]) { xaxis -= 1;}
    // Right D
    if (keys[68]) { xaxis += 1;}
    // Reload R
    if (keys[82]) { reload(tank);}
    // Boost Spacebar
    spacebar = keys[32];

    // ROTATE TURRET TOWARDS MOUSE
    // Don't let turret rotation out of 0-360 range
    if (tank.turretRotation >= 360) {
        tank.turretRotation -= 360;
    } else if (tank.turretRotation < 0) {
        tank.turretRotation += 360;
    }
    // Get turret target rotation
    var turretTargetRotation = Math.atan2(mouseTankOffsetY, mouseTankOffsetX) * 180 / Math.PI;
    // Position pointer at aim position
    aimPointer.x = tank.x + mouseTankOffsetX + 21;
    aimPointer.y = tank.y + mouseTankOffsetY + 21;

    /*
    // Calculate the difference between target and current rotation
    var turrDifference = turretTargetRotation - tank.turretRotation;
    turrDifference += (turrDifference>180) ? -360 : (turrDifference<-180) ? 360 : 0

    //Rotate towards targetRotation
    tank.turretRotation += clamp(turrDifference, -10, 10);*/
    tank.turretRotation = turretTargetRotation;

    // Don't let tank rotation out of 0-360 range
    if (tank.rotation >= 360) {
        tank.rotation -= 360;
    } else if (tank.rotation < 0) {
        tank.rotation += 360;
    }

    // Check movement input
    if (xaxis != 0 || yaxis != 0) {
        if (!spacebar) {
            // Set max speed
            tank.maxSpeed = tankMoveSpeed;
        } else
        if (spacebar && tank.energy > 0) {
            // Set max speed higher
            tank.maxSpeed = tankBoostSpeed;
            // Drain energy
            tank.energy -= (1 + energyRechargeSpeed); // Extra minus to compensate recharge speed
        }

        // Drive forward
        if (tank.movementSpeed < tank.maxSpeed) {
            // Apply acceleration (and deceleration, so effectively deceleration is 0 while driving)
            // Makes sure speed doesn't exceed maxspeed
            var speedIncrease = Math.min(tankAcceleration + tankDeceleration, tank.maxSpeed - tank.movementSpeed);
            // Increase acceleration if boosting
            if (spacebar && tank.energy > 0) {
                speedIncrease *= 2;
            }
            tank.movementSpeed += speedIncrease;
        }

        // Calculate target rotation
        var targetRotation = Math.atan2(yaxis, xaxis) * 180 / Math.PI;

        // Calculate the difference between target and current rotation
        var difference = targetRotation - tank.rotation;
        difference += (difference>180) ? -360 : (difference<-180) ? 360 : 0

        // Calculate turn amount based on how fast tank is moving, so it can't rotate on the spot
        var turnAmount = (turnSpeed / tankMoveSpeed) * tank.movementSpeed;
        //Rotate towards targetRotation
        tank.rotation += clamp(difference, -turnAmount, turnAmount);
    }

    // Shoot if mouse is pressed
    if (mousepressed) {
        shoot(tank);
    }
}

function shoot(tank) {
    if (tank.ammo > 0 && tank.shootDelayTimer == 0) {
        // Consume ammo
        tank.ammo--;

        // Reset shootDelayTimer
        tank.shootDelayTimer = attackSpeed;

        var bulletSpawnDistance = 1.7;

        // Randomize bullet direction by(-2;2) degrees
        var bulletDirection = tank.turretRotation + (Math.random() * 4) - 2;

        // Calculate bullet xspd and yspd based on turrets direction
        var xspd = bulletSpeed*Math.cos(bulletDirection * Math.PI / 180);
        var yspd = bulletSpeed*Math.sin(bulletDirection * Math.PI / 180);

        // Apply knockback to players tank
        tank.xknockback = -xspd * shotKnockbackMultiplier;
        tank.yknockback = -yspd * shotKnockbackMultiplier;

        // Get the x and y spawn position and center it
        var xSpawn = (tank.x + tank.width / 2) + (xspd * bulletSpawnDistance) - 10;
        var ySpawn = (tank.y + tank.height / 2) + (yspd * bulletSpawnDistance) - 5;

        // Get date for unique id
        var date = new Date();

        // Create a bullet
        var bullet = {
            'team': tank.team,
            'damage': bulletDamage,
            'xspd': xspd,
            'yspd': yspd,
            'rotation':tank.turretRotation,
            'x': xSpawn,
            'y': ySpawn,
            'width': 6,
            'height': 6,
            'bulletId':tank.userId+date.getTime()
        };
        bullets.push(bullet);

        // Send bullet to the server
        socket.emit("bullet shot", bullet);
    }
    else
    if (tank.ammo == 0) {
        reload(tank);
    }

}

function reload(tank) {
    if (tank.reloadTimer == -1 && tank.ammo < maxAmmo) {
        tank.reloadTimer = reloadTime;
        tank.ammo = 0;
    }
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}