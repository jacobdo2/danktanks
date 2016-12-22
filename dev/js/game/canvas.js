//only run if document contains element with this id

var canvas  = document.querySelector("#game-canvas");
if(canvas){
    /*
     canvas.width  = canvas.scrollWidth;
     canvas.height = canvas.scrollHeight;*/
    canvas.width  = 1280;
    canvas.height = 720;

    var ctx = canvas.getContext('2d');

//Draw the game
    function draw() {
        // Draw background
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            drawImageRotatedSliced(ctx, shadow, 0, 0, 32, 32, tankX, tankY, tankW, tankH, tankR);

            // Draw tank treads
            var treads = new Image();
            treads.src = './images/tank/tankTreads.png';
            for (i = 0; i < 7; i++) {
                drawImageRotatedSliced(ctx, treads, 32 * i, 0, 32, 32, tankX, tankY - i * 2, tankW, tankH, tankR);
            }

            // Draw tank body
            var body = new Image();
            body.src = './images/tank/tankBody.png';
            for (i = 0; i < 3; i++) {
                drawImageRotatedSliced(ctx, body, 32 * i, 0, 32, 32, tankX, tankY - i * 2 - 13, tankW, tankH, tankR);
            }

            // Draw tank turret
            var turret = new Image();
            turret.src = './images/tank/tankTurret.png';
            for (i = 0; i < 12; i++) {
                drawImageRotatedSliced(ctx, turret, 1 + 32 * i, 0, 32, 32, tankX, tankY - i * 2 - 19, tankW, tankH, tankTR);
            }

            // Draw UI
            // Armor bar
            var armorBarBg = new Image();
            armorBarBg.src = './images/ui/armorBarBg.png';
            ctx.drawImage(armorBarBg, tankX, tankY - 40, 64, 8);

            var armorBar = new Image();
            armorBar.src = './images/ui/armorBar.png';

            var hpPercentage = tank.hp / tank.maxHp;
            ctx.drawImage(armorBar, 0, 0, hpPercentage * 32, 4, tankX, tankY - 40, hpPercentage * 64, 8);

            // Energy bar
            var energyBarBg = new Image();
            energyBarBg.src = './images/ui/energyBarBg.png';
            ctx.drawImage(energyBarBg, tankX, tankY - 32, 64, 8);

            var energyBar = new Image();
            energyBar.src = './images/ui/energyBar.png';

            var energyBarPercentage = tank.energy / 100;
            ctx.drawImage(energyBar, 0, 0, energyBarPercentage * 32, 4, tankX, tankY - 32, energyBarPercentage * 64, 8);

            // Draw ammo
            ctx.font = '24px serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            // If not reloading
            if (tank.ammo >= 0 && tank.reloadTimer <= 0) {
                ctx.fillText(""+tank.ammo, tankX + 32, tankY + 80);
            } else if (tank.reloadTimer > 0) {
                ctx.fillText("Reloading", tankX + 32, tankY + 80);
            }
        }
        // Draw bullets
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            var x = bullet.x;
            var y = bullet.y;
            var w = bullet.width;
            var h = bullet.height;
            var r = bullet.rotation * Math.PI / 180;

            // Draw shadow
            // ctx.fillStyle = 'gray';
            // ctx.fillRect(x, y, w, h);

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
        }
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

