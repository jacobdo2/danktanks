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
            bullets.splice(index, 1);
        }
    }
    // Check for collisions with  tanks
    for (var t = 0; t < tanks.length; t++) {
        var tank = tanks[t];
        if (tank.team != bullet.team && isCollide(bullet, tank, newX, newY)) {
            tank.hp -= bullet.damage;
            tank.xknockback = bullet.xspd * 0.2;
            tank.yknockback = bullet.yspd * 0.2;
            bullets.splice(index, 1);
        }
    }
}