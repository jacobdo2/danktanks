var clientId;

var level = [
    {'width':20000, 'height':50, 'x': 0, 'y':0, 'type':'platform'},
    {'width':50, 'height':20000, 'x': 0, 'y':0, 'type':'platform'},
    {'width':20000, 'height':50, 'x': 0, 'y':19950, 'type':'platform'},
    {'width':50, 'height':20000, 'x': 19950, 'y':0, 'type':'platform'},
    {'width':300, 'height':50, 'x': 400, 'y':300, 'type':'platform'},
    {'width':50, 'height':300, 'x': 1000, 'y':800, 'type':'platform'},
    {'width':200, 'height':200, 'x': 500, 'y':900, 'type':'platform'},
    {'width':300, 'height':50, 'x': 400, 'y':2200, 'type':'platform'},
    {'width':50, 'height':300, 'x': 1200, 'y':1300, 'type':'platform'},
    {'width':300, 'height':50, 'x': 2700, 'y':1400, 'type':'platform'},
    {'width':50, 'height':300, 'x': 2000, 'y':2800, 'type':'platform'}
];
// Tank: hp, team, movement speed, x, y, width, height, body rot, turret rot, xspd, yspd
var defaultTank = {
    'maxHp':160,
    'hp':160,
    'energy':100,
    'ammo':10,
    'reloadTimer':0,
    'shootDelayTimer':0,
    'team':0,
    'maxSpeed':3.5,
    'movementSpeed':0,
    'x':150,
    'y':150,
    'width':72,
    'height':72,
    'rotation':0,
    'turretRotation':0,
    'xspd':0,
    'yspd':0,
    'xknockback':0,
    'yknockback':0,
    'name':'u/lordtuts'
};
var tanks = [

];
var bullets = [

];
// Effect: effectType, x, y, currentIndex, effectLength
var effects = [];
/*
var buttons = [
    {
        'buttonText':'Start game',
        'buttonType':'start',
        'x':570,
        'y':280,
        'width':140,
        'height':50
    },
    {
        'buttonText':'Join game',
        'buttonType':'join',
        'x':570,
        'y':340,
        'width':140,
        'height':50
    }
];*/
var aimPointer = {
    'x':0,
    'y':0,
    'width':2,
    'height':2
};

// Declare game variables

// Input
// Driving direction axis
var xaxis;
var yaxis;

// Mouse
// Absolute position in game world
var mouseX;
var mouseY;
// Positon relative to tank
var mouseTankOffsetX = 0;
var mouseTankOffsetY = 0;
// If mouse is pressed
var mousepressed;

// If spacebar is pressed
var spacebar;

// Currently controlling tank
var tankToControl = tanks[0];

// Tank parameters
var turnSpeed = 240/60; // How fast tank turns, degrees per second, 240 degrees
var attackSpeed = 60/5; // Time before you can shoot again, 5 shots a second
var energyDrainSpeed = 100/(60*1);
var energyRechargeSpeed = 100/(60*5); // Amount of energy it refills in 1/60th second
var reloadTime = 2*60; // Time it takes to reload, seconds
var maxAmmo = 10; // How many bullets tank can hold
var hitKnockbackMultiplier = 0.5; // How strong knockback is from bullet, multiplies bullet's speed
var shotKnockbackMultiplier = 0.4; // How strong tank gets knocked back when shooting, multiplies bullet's speed
var tankMoveSpeed = 3.5; // Top speed of tank when driving
var tankBoostSpeed = 5; // Top speed of tank while boosting
var tankAcceleration = tankMoveSpeed/15; // Acceleration amount in a frame
var tankDeceleration = tankMoveSpeed/10; // Deceleration amount in a frame
var boostAccelerationMultiplier = 1.5; // Multiplier, how many times faster tank accelerates from boost
var knockbackFriction = .75; // Multiplier, how fast tank stops from knockback, max 1 - no friction, min 0 - instantly stops
var bulletSpeed = 12; // How fast bullet moves, pixels/frame
var bulletDamage = 20;

var ticker;
var gameStarted = true; // Whether or not players can control tanks
function moveBullets() {
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        checkBulletCollisions(bullet, bullet.xspd, bullet.yspd, i);

        bullet.x += bullet.xspd;
        bullet.y += bullet.yspd;
    }
}

function checkBulletCollisions(bullet, xspd, yspd, index) {
    var newX = bullet.x + xspd;
    var newY = bullet.y + yspd;

    //Check for collisions with each level object
    for (var i = 0; i < level.length; i++) {
        var obj = level[i];

        if (isCollide(bullet, obj, newX, newY)) {
            var explosionEffect = {
                'effectType':'explosion',
                'x':newX,
                'y':newY,
                'effectIndex':1,
                'effectLength':10
            };
            effects.push(explosionEffect);
            bullets.splice(index, 1);
        }
    }
    // Check for collisions with  tanks
    for (var t = 0; t < tanks.length; t++) {
        var tank = tanks[t];
        if (tank.team != bullet.team && isCollide(bullet, tank, newX, newY)) {
            tank.hp -= bullet.damage;
            // Apply knockback to tank that was hit
            tank.xknockback = bullet.xspd * hitKnockbackMultiplier;
            tank.yknockback = bullet.yspd * hitKnockbackMultiplier;
            bullets.splice(index, 1);
        }
    }
}
//only run if document contains element with this id

var canvas  = document.querySelector("#game-canvas");
if(canvas){

    canvas.width  = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    // canvas.width  = 1280;
    // canvas.height = 720;

    var viewX = 0;
    var viewY = 0;
    var viewW = 1280;
    var viewH = 720;

    var ctx = canvas.getContext('2d');

//Draw the game
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset

        // Center view to the tank
        var differenceX = tankToControl.x - viewX - viewW/2;
        var differenceY = tankToControl.y - viewY - viewH/2;

        // Move the view
        ctx.translate(-differenceX, -differenceY);
        viewX += differenceX;
        viewY += differenceY;

        // Draw background
        var backgroundImage = new Image();
        backgroundImage.src = './images/environment/tile50.png';
        var pattern = ctx.createPattern(backgroundImage, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(-2000, -2000, 24000, 24000);

        // Draw level bottom part
        for (var i = 0; i < level.length; i++) {
            // Probably use this switch for images
            switch(level[i].type) {
                case 'platform':
                    break;
            }
            var obj = level[i];
            var x = obj.x;
            var y = obj.y;
            var w = obj.width;
            var h = obj.height;

            // Draw object bottom
            ctx.fillStyle = '#3c3636';
            ctx.fillRect(x, y, w, h);
        }

        // Sort tanks so they draw in correct order
        tanks.sort(function(a, b) {
            return a.y - b.y;
        });
        // Draw tanks
        for (var t = 0; t < tanks.length; t++) {
            var tank = tanks[t];
            //Draw tank
            ctx.fillStyle = 'green';
            var tankX = tank.x + 4;
            var tankY = tank.y + 4;
            var tankW = 64;
            var tankH = 64;
            var tankR = tank.rotation * Math.PI / 180;
            var tankTR = tank.turretRotation * Math.PI / 180;
            //ctx.fillRect(x, y, w, h);
            //drawRotated(ctx, x, y, w, h, r);

            // Draw tank shadow
            var shadow = new Image();
            shadow.src = './images/tank/tankShadow.png';
            drawImageRotatedSliced(ctx, shadow, 0, 0, 64, 64, tankX, tankY, tankW, tankH, tankR);

            // Draw tank treads
            var treads = new Image();
            treads.src = './images/tank/tankTreads.png';
            for (i = 0; i < 7; i++) {
                drawImageRotatedSliced(ctx, treads, 64 * i, 0, 64, 64, tankX, tankY - i * 2, tankW, tankH, tankR);
            }

            // Draw tank body
            var body = new Image();
            body.src = './images/tank/tankBody.png';
            for (i = 0; i < 3; i++) {
                drawImageRotatedSliced(ctx, body, 64 * i, 0, 64, 64, tankX, tankY - i * 2 - 13, tankW, tankH, tankR);
            }

            // Draw tank turret
            var turret = new Image();
            turret.src = './images/tank/tankTurret.png';
            for (i = 0; i < 12; i++) {
                drawImageRotatedSliced(ctx, turret, 1 + 64 * i, 0, 64, 64, tankX, tankY - i * 2 - 19, tankW, tankH, tankTR);
            }
            // Draw tank name
            ctx.font = '18px serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.fillText(""+tank.name, tankX + tankW / 2, tankY - 24);
        }

        // Draw bullets
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            var x = bullet.x;
            var y = bullet.y;
            var w = bullet.width;
            var h = bullet.height;
            var r = bullet.rotation * Math.PI / 180;

            // Draw bullet shadow
            var bulletShadow = new Image();
            bulletShadow.src = './images/tank/bulletShadow.png';
            drawImageRotated(ctx, bulletShadow, x , y, 20, 10, r);

            // Draw bullet
            var bullet = new Image();
            bullet.src = './images/tank/bullet.png';
            drawImageRotated(ctx, bullet, x , y-24, 20, 10, r);
        }

        // Draw effects
        for (var i = 0; i < effects.length; i++) {
            var effect = effects[i];
            var effectImage = new Image();
            // Change effect image based on what type of effect it is
            switch (effect.effectType) {
                case 'explosion':
                    effectImage.src = './images/effects/explosion.png';
                    break;
                case 'something else':
                    break;
            }
            var effectWidth = effectImage.naturalWidth / effect.effectLength;
            var effectHeight = effectImage.naturalHeight;
            var effectX = effect.x - effectWidth/2;
            var effectY = effect.y - effectHeight/2;
            ctx.drawImage(effectImage, effectWidth * effect.effectIndex, 0, effectWidth, effectHeight, effectX, effectY, effectWidth, effectHeight);
        }

        // Draw level top part
        for (var i = 0; i < level.length; i++) {
            // Probably use this switch for images
            switch(level[i].type) {
                case 'platform':
                    break;
            }
            var obj = level[i];
            var x = obj.x;
            var y = obj.y;
            var w = obj.width;
            var h = obj.height;

            // Draw object top
            ctx.fillStyle = '#5a5251';
            ctx.fillRect(x, y-50, w, h);
        }

        // Draw buttons
        /*
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var text = button.buttonText;
            var x = button.x;
            var y = button.y;
            var w = button.width;
            var h = button.height;

            ctx.fillStyle = 'black';
            ctx.fillRect(x, y, w, h);

            ctx.font = '24px serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText(text, x + w/2, y+h/2);
        }*/

        // Draw player UI
        // Draw pointer
        /*
        var pointerImage = new Image();
        pointerImage.src = './images/ui/pointer.png';
        ctx.drawImage(pointerImage, aimPointer.x + 1, aimPointer.y + 1);*/
        // Ammo UI
        ctx.font = '64px serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'black';
        var ammoTextX = viewX + viewW - 30;
        var ammoTextY = viewY + viewH - 20;
        // Draw ammo text
        if (tankToControl.ammo > 0 && tank.reloadTimer <= 0) {
            ctx.fillText(""+tankToControl.ammo, ammoTextX, ammoTextY);
        } else if (tankToControl.reloadTimer > 0) {
            ctx.fillText("Reloading", ammoTextX, ammoTextY);
        }

        // Armor and energy bars
        // Bar parameters
        var barUiOffsetX = 12;
        var barUiOffsetY = viewH - 74;
        // Get background and glass image
        var uiBarBg = new Image();
        uiBarBg.src = './images/ui/uiBarBg.png';
        var uiBarGlass = new Image();
        uiBarGlass.src = './images/ui/uiBarGlass.png';
        // Armor bar
        // Background
        ctx.drawImage(uiBarBg, viewX + barUiOffsetX, viewY + barUiOffsetY, 256, 64);
        // Armor bar
        var armorBar = new Image();
        armorBar.src = './images/ui/armorBar.png';
        var hpPercentage = tank.hp / tank.maxHp;
        ctx.drawImage(armorBar, 0, 0, hpPercentage * 256, 64, viewX + barUiOffsetX, viewY + barUiOffsetY, hpPercentage * 256, 64);
        // Glass
        ctx.drawImage(uiBarGlass, viewX + barUiOffsetX, viewY + barUiOffsetY, 256, 64);

        // Energy bar
        // Background
        ctx.drawImage(uiBarBg, viewX + 256 + barUiOffsetX * 2, viewY + barUiOffsetY, 256, 64);
        // Energy bar
        var energyBar = new Image();
        energyBar.src = './images/ui/energyBar.png';
        var energyBarPercentage = tank.energy / 100;
        ctx.drawImage(energyBar, 0, 0, energyBarPercentage * 256, 64, viewX + 256 + barUiOffsetX * 2, viewY + barUiOffsetY, energyBarPercentage * 256, 64);
        // Glass
        ctx.drawImage(uiBarGlass, viewX + 256 + barUiOffsetX * 2, viewY + barUiOffsetY, 256, 64);
    }

    function drawRotated(ctx, x, y, width, height, rotation) {

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        ctx.save();

        ctx.translate(x + halfWidth, y + halfHeight);
        ctx.rotate(rotation);
        ctx.fillRect(-halfWidth, -halfHeight, width, height);

        ctx.restore();
    }

    function drawImageRotated(ctx, image, x, y, width, height, rotation) {

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        ctx.save();

        ctx.translate(x + halfWidth, y + halfHeight);
        ctx.rotate(rotation);
        ctx.drawImage(image, -halfHeight, -halfHeight, width, height);

        ctx.restore();
    }

    function drawImageRotatedSliced(ctx, image, sliceX, sliceY, sliceWidth, sliceHeight, x, y, width, height, rotation) {

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        ctx.save();

        ctx.translate(x + halfWidth, y + halfHeight);
        ctx.rotate(rotation);
        ctx.drawImage(image, sliceX, sliceY, sliceWidth, sliceHeight, -halfWidth, -halfHeight, width, height);

        ctx.restore();
    }
}



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
                updateEffects();
            }
            draw();
        }, 16.67);
    });
};

var spawnPositions = [
    {'x':150, 'y':150},
    {'x':1130, 'y':150},
    {'x':1130, 'y':570},
    {'x':150, 'y':570},
];

function checkButtonPress() {
    var buttonPressed = false;
    // Check button presses
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (isCollide(pointer, button, pointer.x, pointer.y)) {
            switch(button.buttonType) {
                case 'join':
                    /*
                    var newTank = clone(defaultTank);
                    newTank.x = spawnPositions[tankCount].x;
                    newTank.y = spawnPositions[tankCount].y;
                    newTank.team = tankCount;
                    tankToControl = newTank;
                    tanks.push(newTank);
                    tankCount++;*/
                    break;
                case 'start':
                    // insert countdown
                    gameStarted = true;
                    break;
            }

            buttonPressed = true;
        }
    }

    return buttonPressed;
}

function updateEffects() {
    // Loop through all effects
    for (var i = 0; i < effects.length; i++) {
        var effect = effects[i];
        effect.effectIndex++;
        if (effect.effectIndex > effect.effectLength) {
            effects.splice(i, 1);
        }
    }
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
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
        // Default max speed to normal driving speed
        tank.maxSpeed = tankMoveSpeed;

        if (spacebar && tank.energy > 0) {
            // Set max speed higher
            tank.maxSpeed = tankBoostSpeed;
            // Drain energy
            tank.energy -= (energyDrainSpeed + energyRechargeSpeed); // Extra minus to compensate recharge speed
        }

        // Drive forward
        if (tank.movementSpeed < tank.maxSpeed) {
            // Apply acceleration (and deceleration, so effectively deceleration is 0 while driving)
            // Makes sure speed doesn't exceed maxspeed
            var speedIncrease = Math.min(tankAcceleration + tankDeceleration, tank.maxSpeed - tank.movementSpeed);
            // Increase acceleration if boosting
            if (spacebar && tank.energy > 0) {
                speedIncrease *= boostAccelerationMultiplier;
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