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