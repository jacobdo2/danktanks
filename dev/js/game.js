var energyRechargeSpeed = 100/(60*4); // 4 seconds
var reloadTime = 60*3; // 3 seconds
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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}