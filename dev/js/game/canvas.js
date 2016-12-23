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
        backgroundImage.src = './images/environment/concrete.png';
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
        ctx.font = '56px serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'black';
        var ammoTextX = viewX + viewW - 30;
        var ammoTextY = viewY + viewH - 30;
        // Draw ammo text
        if (tankToControl.ammo > 0 && tank.reloadTimer <= 0) {
            ctx.fillText(""+tankToControl.ammo, ammoTextX, ammoTextY);
        } else if (tankToControl.reloadTimer > 0) {
            ctx.fillText("Reloading", ammoTextX, ammoTextY);
        }

        // Armor and energy bars
        // Get background and glass image
        var uiBarBg = new Image();
        uiBarBg.src = './images/ui/uiBarBg.png';
        var uiBarGlass = new Image();
        uiBarGlass.src = './images/ui/uiBarGlass.png';
        // Armor bar
        // Background
        ctx.drawImage(uiBarBg, viewX, viewY + viewH - 128, 256, 64);
        // Armor bar
        var armorBar = new Image();
        armorBar.src = './images/ui/armorBar.png';
        var hpPercentage = tank.hp / tank.maxHp;
        ctx.drawImage(armorBar, 0, 0, hpPercentage * 256, 64, viewX, viewY + viewH - 128, hpPercentage * 256, 64);
        // Glass
        ctx.drawImage(uiBarGlass, viewX, viewY + viewH - 128, 256, 64);

        // Energy bar
        // Background
        ctx.drawImage(uiBarBg, viewX, viewY + viewH - 64, 256, 64);
        // Energy bar
        var energyBar = new Image();
        energyBar.src = './images/ui/energyBar.png';
        var energyBarPercentage = tank.energy / 100;
        ctx.drawImage(energyBar, 0, 0, energyBarPercentage * 256, 64, viewX, viewY + viewH - 64, energyBarPercentage * 256, 64);
        // Glass
        ctx.drawImage(uiBarGlass, viewX, viewY + viewH - 64, 256, 64);
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


